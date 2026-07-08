import { ingredientKeys } from "@/lib/query-keys";
import type { UseQueryResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchIngredients() {
  const res = await fetch("/api/ingredients");
  if (!res.ok) throw new Error("Failed to fetch ingredients");
  return res.json();
}

async function createIngredient(data: Record<string, unknown>) {
  const res = await fetch("/api/ingredients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create ingredient");
  }
  return res.json();
}

async function updateIngredient(id: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/ingredients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update ingredient");
  }
  return res.json();
}

async function deleteIngredient(id: string) {
  const res = await fetch(`/api/ingredients/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete ingredient");
  }
  return res.json();
}

export type IngredientWithCount = any & { _count: { recipes: number } };

export function useIngredients(): UseQueryResult<IngredientWithCount[], unknown> {
  return useQuery({
    queryKey: ingredientKeys.lists(),
    queryFn: fetchIngredients,
  });
}

export function useCreateIngredient(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() });
      onSuccess?.();
    },
  });
}

export function useUpdateIngredient(id: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => updateIngredient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ingredientKeys.detail(id) });
      onSuccess?.();
    },
  });
}

export function useDeleteIngredient(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() });
      onSuccess?.();
    },
  });
}
