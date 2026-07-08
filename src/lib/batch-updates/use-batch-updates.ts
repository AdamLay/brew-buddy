import { batchUpdateKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function getBatchUpdates(batchId: string) {
  const res = await fetch(`/api/batch-updates?batchId=${batchId}`);
  if (!res.ok) throw new Error("Failed to fetch batch updates");
  return res.json();
}

async function createBatchUpdate(data: {
  batchId: string;
  timestamp?: Date;
  notes?: string;
  image?: string;
}) {
  const res = await fetch("/api/batch-updates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create update");
  }
  return res.json();
}

export function useBatchUpdates(batchId: string) {
  return useQuery({
    queryKey: batchUpdateKeys.byBatch(batchId),
    queryFn: () => getBatchUpdates(batchId),
    enabled: !!batchId,
  });
}

export function useCreateBatchUpdate(batchId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBatchUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchUpdateKeys.byBatch(batchId) });
      onSuccess?.();
    },
  });
}
