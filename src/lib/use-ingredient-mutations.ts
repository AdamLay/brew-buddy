import {
  createIngredientFn,
  deleteIngredientFn,
  updateIngredientFn,
} from "@/lib/ingredient-mutations";
import { ingredientKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type IngredientInput = {
  name: string;
  description?: string | null;
  type?: "juice" | "fruit" | "sugar" | "yeast" | "hops" | "spice" | "other" | null;
};

export function useCreateIngredient(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IngredientInput) => {
      console.log("useCreateIngredient mutation called with data:", data);
      return createIngredientFn(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() });
      onSuccess?.();
    },
  });
}

export function useUpdateIngredient(id: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IngredientInput) => updateIngredientFn({ id, data } as any),
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
    mutationFn: (id: string) => deleteIngredientFn(id as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() });
      onSuccess?.();
    },
  });
}
