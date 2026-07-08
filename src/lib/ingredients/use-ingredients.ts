import { prisma } from "@/lib/db";
import { ingredientKeys } from "@/lib/query-keys";
import type { UseQueryResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ingredientSchema, type IngredientData } from "./ingredient-validation";

const fetchIngredientsFn = createServerFn({ method: "GET" }).handler(async () => {
  const ingredients = await prisma.ingredient.findMany({
    include: { _count: { select: { recipes: true } } },
  });
  return ingredients;
});

export type IngredientWithCount = any & { _count: { recipes: number } };

export function useIngredients(): UseQueryResult<IngredientWithCount[], unknown> {
  return useQuery({
    queryKey: ingredientKeys.lists(),
    queryFn: async () => await fetchIngredientsFn(),
  });
}

export const createIngredientFn = createServerFn({ method: "POST" })
  .validator(ingredientSchema)
  .handler(async ({ data }) => {
    console.log("createIngredient called with data:", data);
    return await prisma.ingredient.create({ data });
  });

export function useCreateIngredient(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IngredientData) => createIngredientFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() });
      onSuccess?.();
    },
  });
}

const updateIngredientValidator = z.object({ id: z.string(), data: ingredientSchema });

export const updateIngredientFn = createServerFn({ method: "POST" })
  .validator(updateIngredientValidator)
  .handler(async ({ data }) => {
    const existing = await prisma.ingredient.findUnique({ where: { id: data.id } });
    if (!existing) throw new Error("NOT_FOUND");
    return prisma.ingredient.update({ where: { id: data.id }, data: data.data });
  });

export function useUpdateIngredient(id: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IngredientData) => updateIngredientFn({ data: { id, data } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ingredientKeys.detail(id) });
      onSuccess?.();
    },
  });
}

export const deleteIngredientFn = createServerFn({ method: "POST" })
  .validator(z.string())
  .handler(async ({ data }) => {
    try {
      return await prisma.ingredient.delete({ where: { id: data } });
    } catch (err) {
      if ((err as any).code === "P2025") throw new Error("NOT_FOUND");
      throw err;
    }
  });

export function useDeleteIngredient(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteIngredientFn({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() });
      onSuccess?.();
    },
  });
}
