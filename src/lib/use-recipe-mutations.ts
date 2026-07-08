import { recipeKeys } from "@/lib/query-keys";
import { createRecipeFn, deleteRecipeFn, updateRecipeFn } from "@/lib/recipe-mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateRecipe(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createRecipeFn(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      onSuccess?.();
    },
  });
}

export function useUpdateRecipe(id: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updateRecipeFn({ id, data } as any),
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
    mutationFn: (id: string) => deleteRecipeFn(id as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      onSuccess?.();
    },
  });
}
