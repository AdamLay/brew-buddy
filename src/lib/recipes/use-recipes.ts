import { prisma } from "@/lib/db";
import { recipeKeys } from "@/lib/query-keys";
import type { UseQueryResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { recipeSchema, type RecipeData } from "./recipe-validation";

const fetchRecipesFn = createServerFn({ method: "GET" }).handler(async () => {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { batches: true } } },
  });
  return recipes;
});

export type RecipeWithCount = any & { _count: { batches: number } };

export function useRecipes(): UseQueryResult<RecipeWithCount[], unknown> {
  return useQuery({
    queryKey: recipeKeys.lists(),
    queryFn: async () => await fetchRecipesFn(),
  });
}

export const createRecipeFn = createServerFn({ method: "POST" })
  .validator(recipeSchema)
  .handler(async ({ data }) => {
    return await prisma.recipe.create({ data });
  });

export function useCreateRecipe(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RecipeData) => createRecipeFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      onSuccess?.();
    },
  });
}

const updateRecipeValidator = z.object({ id: z.string(), data: recipeSchema });

export const updateRecipeFn = createServerFn({ method: "POST" })
  .validator(updateRecipeValidator)
  .handler(async ({ data }) => {
    const existing = await prisma.recipe.findUnique({ where: { id: data.id } });
    if (!existing) throw new Error("NOT_FOUND");
    return prisma.recipe.update({ where: { id: data.id }, data: data.data });
  });

export function useUpdateRecipe(id: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RecipeData) => updateRecipeFn({ data: { id, data } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(id) });
      onSuccess?.();
    },
  });
}

export const deleteRecipeFn = createServerFn({ method: "POST" })
  .validator(z.string())
  .handler(async ({ data }) => {
    try {
      return await prisma.recipe.delete({ where: { id: data } });
    } catch (err) {
      if ((err as any).code === "P2025") throw new Error("NOT_FOUND");
      throw err;
    }
  });

export function useDeleteRecipe(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRecipeFn({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      onSuccess?.();
    },
  });
}
