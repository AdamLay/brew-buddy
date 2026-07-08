import { batchKeys } from "@/lib/query-keys";
import type { UseQueryResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BatchData } from "./batch-validation";

async function fetchBatches() {
  const res = await fetch("/api/batches");
  if (!res.ok) throw new Error("Failed to fetch batches");
  return res.json();
}

async function getBatchesByRecipe(recipeId: string) {
  const res = await fetch(`/api/batches?recipeId=${recipeId}`);
  if (!res.ok) throw new Error("Failed to fetch batches by recipe");
  return res.json();
}

async function createBatch(data: BatchData) {
  const res = await fetch("/api/batches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create batch");
  }
  return res.json();
}

async function updateBatch(id: string, data: BatchData) {
  const res = await fetch(`/api/batches/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update batch");
  }
  return res.json();
}

async function deleteBatch(id: string) {
  const res = await fetch(`/api/batches/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete batch");
  }
  return res.json();
}

async function getRecipeIngredients(recipeId: string) {
  const res = await fetch(`/api/recipes/${recipeId}/ingredients`);
  if (!res.ok) throw new Error("Failed to fetch recipe ingredients");
  return res.json();
}

export type BatchWithRecipe = any & {
  recipe: { name: string; brewType: string };
};

export function useBatches(): UseQueryResult<BatchWithRecipe[], unknown> {
  return useQuery({
    queryKey: batchKeys.lists(),
    queryFn: fetchBatches,
  });
}

export function useBatchesByRecipe(recipeId: string) {
  return useQuery({
    queryKey: batchKeys.byRecipe(recipeId),
    queryFn: () => getBatchesByRecipe(recipeId),
    enabled: !!recipeId,
  });
}

export function useCreateBatch(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
      onSuccess?.();
    },
  });
}

export function useUpdateBatch(id: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BatchData) => updateBatch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
      queryClient.invalidateQueries({ queryKey: batchKeys.detail(id) });
      onSuccess?.();
    },
  });
}

export function useDeleteBatch(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
      onSuccess?.();
    },
  });
}

export function useRecipeIngredients(recipeId: string) {
  return useQuery({
    queryKey: batchKeys.recipeIngredients(recipeId),
    queryFn: () => getRecipeIngredients(recipeId),
    enabled: !!recipeId,
  });
}
