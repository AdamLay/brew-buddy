import { recipeKeys } from "@/lib/query-keys";
import { createRecipeFn, deleteRecipeFn, updateRecipeFn } from "@/lib/recipe-mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type RecipeInput = {
  name: string;
  brewType: string;
  description?: string | null;
  instructions?: string | null;
  batchSize?: number | null;
};

export function useCreateRecipe(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RecipeInput) => createRecipeFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      onSuccess?.();
    },
  });
}

export function useUpdateRecipe(id: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RecipeInput) => updateRecipeFn({ data: { id, data } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(id) });
      onSuccess?.();
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
