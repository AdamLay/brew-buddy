import { prisma } from "@/lib/db";
import { batchKeys } from "@/lib/query-keys";
import type { UseQueryResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { batchSchema, type BatchData } from "./batch-validation";

const fetchBatchesFn = createServerFn({ method: "GET" }).handler(async () => {
  const batches = await prisma.batch.findMany({
    orderBy: { createdAt: "desc" },
    include: { recipe: { select: { name: true, brewType: true } } },
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
    return await prisma.batch.create({ data });
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
    const existing = await prisma.batch.findUnique({ where: { id: data.id } });
    if (!existing) throw new Error("NOT_FOUND");

    // Auto-set endDate when status changes away from PLANNING/FERMENTING
    let endDate = data.data.endDate;
    if (data.data.status && !["PLANNING", "FERMENTING"].includes(data.data.status)) {
      endDate = new Date();
    }

    return prisma.batch.update({ where: { id: data.id }, data: { ...data.data, endDate } });
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
