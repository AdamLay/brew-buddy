import { prisma } from "@/lib/db";
import { batchKeys } from "@/lib/query-keys";
import type { UseQueryResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { BATCH_STATUSES, batchSchema, type BatchData } from "./batch-validation";

const fetchBatchesFn = createServerFn({ method: "GET" }).handler(async () => {
  const batches = await prisma.batch.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      recipe: { select: { name: true, brewType: true } },
      ingredients: {
        include: {
          ingredient: { select: { name: true } },
          recipeIngredient: { select: { amount: true, unit: true } },
        },
      },
    },
  });
  return batches;
});

export type BatchWithRecipe = any & {
  recipe: { name: string; brewType: string };
};

export function useBatches(): UseQueryResult<BatchWithRecipe[], unknown> {
  return useQuery({
    queryKey: batchKeys.lists(),
    queryFn: async () => await fetchBatchesFn(),
  });
}

const getBatchesByRecipeFn = createServerFn({ method: "GET" })
  .validator((data: { recipeId: string }) => data)
  .handler(async ({ data }) => {
    const batches = await prisma.batch.findMany({
      where: { recipeId: data.recipeId },
      orderBy: { createdAt: "desc" },
    });
    return batches;
  });

export function useBatchesByRecipe(recipeId: string) {
  return useQuery({
    queryKey: batchKeys.byRecipe(recipeId),
    queryFn: async () => await getBatchesByRecipeFn({ data: { recipeId } }),
    enabled: !!recipeId,
  });
}

export const createBatchFn = createServerFn({ method: "POST" })
  .validator(batchSchema)
  .handler(async ({ data }) => {
    console.log("createBatchFn - incoming data:", JSON.stringify(data, null, 2));
    const { ingredients, ...batchData } = data;
    console.log("createBatchFn - batchData:", batchData);
    console.log("createBatchFn - ingredients:", JSON.stringify(ingredients, null, 2));

    const include = {
      recipe: { select: { name: true, brewType: true } },
      ingredients: {
        include: {
          ingredient: { select: { name: true, defaultPrice: true } },
          recipeIngredient: {
            select: { amount: true, unit: true, ingredientId: true },
          },
        },
      },
    };

    if (ingredients && ingredients.length > 0) {
      // Fetch recipe ingredient data to get amount, unit, and ingredientId
      const recipeIngredientIds = ingredients.map((ing) => ing.recipeIngredientId);
      const recipeIngredients = await prisma.recipeIngredient.findMany({
        where: {
          id: { in: recipeIngredientIds },
          recipeId: data.recipeId,
        },
        select: {
          id: true,
          amount: true,
          unit: true,
          ingredientId: true,
        },
      });

      const riMap = new Map(recipeIngredients.map((ri) => [ri.id, ri]));

      const batchIngredients = ingredients.map((ing) => {
        const ri = riMap.get(ing.recipeIngredientId);
        return {
          recipeIngredientId: ing.recipeIngredientId,
          ingredientId: ri?.ingredientId ?? "",
          amount: ri?.amount ?? 0,
          unit: ri?.unit ?? "",
          price: ing.priceOverride,
        };
      });

      console.log(
        "[createBatchFn] Ingredients to create:",
        JSON.stringify(batchIngredients, null, 2),
      );
      console.log("[createBatchFn] batchData keys:", Object.keys(batchData));
      console.log("[createBatchFn] batchData.status:", (batchData as any).status);
      console.log("[createBatchFn] batchData.recipeId:", (batchData as any).recipeId);

      const created = await prisma.$transaction(async (tx) => {
        const batch = await tx.batch.create({
          data: {
            ...(batchData as any),
            ingredients: {
              create: batchIngredients,
            },
          },
          include,
        });
        console.log("[createBatchFn] Created batch with", batch.ingredients.length, "ingredients");
        return batch;
      });

      return created;
    }

    return await prisma.batch.create({
      data: batchData as any,
      include,
    });
  });

export function useCreateBatch(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BatchData) => createBatchFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
      onSuccess?.();
    },
  });
}

const updateBatchValidator = z.object({ id: z.string(), data: batchSchema });

export const updateBatchFn = createServerFn({ method: "POST" })
  .validator(updateBatchValidator)
  .handler(async ({ data }) => {
    const existing = await prisma.batch.findUnique({
      where: { id: data.id },
      include: { recipe: { select: { name: true, brewType: true } } },
    });
    if (!existing) throw new Error("NOT_FOUND");

    // Auto-set endDate when status changes away from PLANNING/FERMENTING
    let endDate = data.data.endDate;
    if (data.data.status === "COMPLETE") {
      endDate = new Date();
    }

    const { ingredients, recipeId, ...batchUpdate } = data.data;

    const include = {
      recipe: { select: { name: true, brewType: true } },
      ingredients: {
        include: {
          ingredient: { select: { name: true, defaultPrice: true } },
          recipeIngredient: {
            select: { amount: true, unit: true, ingredientId: true },
          },
        },
      },
    };

    // If no ingredients sent, update batch fields directly
    if (!ingredients || ingredients.length === 0) {
      return prisma.batch.update({
        where: { id: data.id },
        data: { ...batchUpdate, endDate },
        include,
      });
    }

    // Fetch recipe ingredient data to get amount, unit, and ingredientId
    const recipeIngredientIds = ingredients.map((ing) => ing.recipeIngredientId);
    const recipeIngredients = await prisma.recipeIngredient.findMany({
      where: {
        id: { in: recipeIngredientIds },
        recipeId,
      },
      select: {
        id: true,
        amount: true,
        unit: true,
        ingredientId: true,
      },
    });

    const riMap = new Map(recipeIngredients.map((ri) => [ri.id, ri]));

    const batchIngredients = ingredients.map((ing) => {
      const ri = riMap.get(ing.recipeIngredientId);
      return {
        batchId: data.id,
        recipeIngredientId: ing.recipeIngredientId,
        ingredientId: ri?.ingredientId ?? "",
        amount: ri?.amount ?? 0,
        unit: ri?.unit ?? "",
        price: ing.priceOverride,
      };
    });

    return prisma.$transaction(async (tx) => {
      // Update batch fields
      await tx.batch.update({
        where: { id: data.id },
        data: { ...batchUpdate, endDate, status: data.data.status },
      });

      // Delete existing ingredients and create new ones
      await tx.batchIngredient.deleteMany({ where: { batchId: data.id } });
      if (batchIngredients.length > 0) {
        await tx.batchIngredient.createMany({
          data: batchIngredients,
        });
      }

      return tx.batch.findUnique({
        where: { id: data.id },
        include,
      });
    });
  });

export function useUpdateBatch(id: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BatchData) => updateBatchFn({ data: { id, data } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
      queryClient.invalidateQueries({ queryKey: batchKeys.detail(id) });
      onSuccess?.();
    },
  });
}

export const updateBatchStatusFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), status: z.enum(BATCH_STATUSES) }))
  .handler(async ({ data }) => {
    const existing = await prisma.batch.findUnique({
      where: { id: data.id },
    });
    if (!existing) throw new Error("NOT_FOUND");

    let endDate: Date | undefined;
    if (data.status === "COMPLETE") {
      endDate = new Date();
    }

    return prisma.batch.update({
      where: { id: data.id },
      data: { status: data.status, ...(endDate ? { endDate } : {}) },
      include: {
        recipe: { select: { name: true, brewType: true } },
        ingredients: {
          include: {
            ingredient: { select: { name: true, defaultPrice: true } },
            recipeIngredient: { select: { amount: true, unit: true } },
          },
        },
      },
    });
  });

export function useUpdateBatchStatus(id: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: (typeof BATCH_STATUSES)[number]) =>
      updateBatchStatusFn({ data: { id, status } }),
    onSuccess: (_data, _vars) => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
      queryClient.invalidateQueries({ queryKey: batchKeys.detail(id) });
      onSuccess?.();
    },
  });
}

export const deleteBatchFn = createServerFn({ method: "POST" })
  .validator(z.string())
  .handler(async ({ data }) => {
    try {
      return await prisma.batch.delete({ where: { id: data } });
    } catch (err) {
      if ((err as any).code === "P2025") throw new Error("NOT_FOUND");
      throw err;
    }
  });

export function useDeleteBatch(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBatchFn({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
      onSuccess?.();
    },
  });
}

export const getRecipeIngredientsFn = createServerFn({ method: "GET" })
  .validator((data: { recipeId: string }) => data)
  .handler(async ({ data }) => {
    return prisma.recipeIngredient.findMany({
      where: { recipeId: data.recipeId },
      include: {
        ingredient: { select: { id: true, name: true, defaultPrice: true } },
      },
      orderBy: { ingredient: { name: "asc" } },
    });
  });

export function useRecipeIngredients(recipeId: string) {
  return useQuery({
    queryKey: batchKeys.recipeIngredients(recipeId),
    queryFn: async () => await getRecipeIngredientsFn({ data: { recipeId } }),
    enabled: !!recipeId,
  });
}
