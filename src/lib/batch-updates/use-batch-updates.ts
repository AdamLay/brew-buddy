import { prisma } from "@/lib/db";
import { batchUpdateKeys } from "@/lib/query-keys";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { batchUpdateSchema, type BatchUpdateData } from "./batch-update-validation";

const getBatchUpdatesFn = createServerFn({ method: "GET" })
  .validator((data: { batchId: string }) => data)
  .handler(async ({ data }) => {
    return await prisma.batchUpdate.findMany({
      where: { batchId: data.batchId },
      orderBy: { timestamp: "desc" },
    });
  });

export function useBatchUpdates(batchId: string) {
  return useQuery({
    queryKey: batchUpdateKeys.byBatch(batchId),
    queryFn: async () => await getBatchUpdatesFn({ data: { batchId } }),
    enabled: !!batchId,
  });
}

export const createBatchUpdateFn = createServerFn({ method: "POST" })
  .validator(batchUpdateSchema)
  .handler(async ({ data }) => {
    return await prisma.batchUpdate.create({
      data: {
        batchId: data.batchId,
        timestamp: data.timestamp || new Date(),
        notes: data.notes || null,
        image: data.image || null,
      },
    });
  });

export function useCreateBatchUpdate(batchId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BatchUpdateData) => createBatchUpdateFn({ data: { ...data, batchId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchUpdateKeys.byBatch(batchId) });
      onSuccess?.();
    },
  });
}
