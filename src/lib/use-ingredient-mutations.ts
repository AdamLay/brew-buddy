import {
  createIngredientFn,
  deleteIngredientFn,
  updateIngredientFn,
} from "@/lib/ingredient-mutations";
import { ingredientKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IngredientData } from "./ingredient-validation";

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
