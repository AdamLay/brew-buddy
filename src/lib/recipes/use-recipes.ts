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
    include: {
      _count: { select: { batches: true } },
      ingredients: { include: { ingredient: true } },
    },
  });
  return recipes;
});

export type RecipeWithCount = any & {
  _count: { batches: number };
  ingredients: {
    id: string;
    amount: number;
    unit: string;
    notes: string | null;
    ingredientId: string;
    recipeId: string;
    createdAt: Date;
    ingredient: any;
  }[];
};

export function useRecipes(): UseQueryResult<RecipeWithCount[], unknown> {
  return useQuery({
    queryKey: recipeKeys.lists(),
    queryFn: async () => await fetchRecipesFn(),
  });
}

export const createRecipeFn = createServerFn({ method: "POST" })
  .validator(recipeSchema)
  .handler(async ({ data }) => {
    const { ingredients, ...recipeData } = data;
    return await prisma.$transaction(async (tx) => {
      const recipe = await tx.recipe.create({ data: recipeData });
      if (ingredients?.length) {
        await tx.recipeIngredient.createMany({
          data: ingredients.map((ing) => ({ ...ing, recipeId: recipe.id })),
        });
      }
      return tx.recipe.findUnique({
        where: { id: recipe.id },
        include: { ingredients: { include: { ingredient: true } } },
      });
    });
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
    const { ingredients, ...recipeData } = data.data;
    return await prisma.$transaction(async (tx) => {
      await tx.recipeIngredient.deleteMany({ where: { recipeId: data.id } });
      if (ingredients?.length) {
        await tx.recipeIngredient.createMany({
          data: ingredients.map((ing) => ({ ...ing, recipeId: data.id })),
        });
      }
      return tx.recipe.update({
        where: { id: data.id },
        data: recipeData,
        include: { ingredients: { include: { ingredient: true } } },
      });
    });
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
      console.log("Deleting recipe:", data);
      return await prisma.recipe.delete({ where: { id: data } });
    } catch (err) {
      if ((err as any).code === "P2025") throw new Error("NOT_FOUND");
      throw err;
    }
  });

export const cloneRecipeFn = createServerFn({ method: "POST" })
  .validator(z.object({ recipeId: z.string() }))
  .handler(async ({ data }) => {
    const existing = await prisma.recipe.findUnique({
      where: { id: data.recipeId },
      include: { ingredients: true },
    });
    if (!existing) throw new Error("RECIPE_NOT_FOUND");

    const copyName = `${existing.name} (Copy)`;
    return await prisma.$transaction(async (tx) => {
      console.log("Cloning recipe:", existing.id, "as", copyName);
      const recipe = await tx.recipe.create({
        data: {
          name: copyName,
          description: existing.description,
          brewType: existing.brewType,
          instructions: existing.instructions,
        },
      });
      if (existing.ingredients.length > 0) {
        await tx.recipeIngredient.createMany({
          data: existing.ingredients.map((ing) => ({
            recipeId: recipe.id,
            ingredientId: ing.ingredientId,
            amount: ing.amount,
            unit: ing.unit,
            notes: ing.notes,
          })),
        });
      }
      return tx.recipe.findUnique({
        where: { id: recipe.id },
        include: { ingredients: { include: { ingredient: true } } },
      });
    });
  });

export function useCloneRecipe(onSuccess?: (id: string) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipeId: string) => cloneRecipeFn({ data: { recipeId } }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      onSuccess?.(data!.id);
    },
  });
}

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

const fetchRecipeUnitsFn = createServerFn({ method: "GET" }).handler(async () => {
  const units = await prisma.recipeIngredient.findMany({
    select: { unit: true },
    distinct: ["unit"],
    where: { unit: { not: "" } },
    orderBy: { unit: "asc" },
  });
  return units.map((u) => u.unit);
});

export function useRecipeUnits(): UseQueryResult<string[], unknown> {
  return useQuery({
    queryKey: recipeKeys.unitOptions(),
    queryFn: async () => await fetchRecipeUnitsFn(),
  });
}
