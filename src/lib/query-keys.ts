// ─── Query Keys (pure factories, no side-effects) ──────────────
// Universal — safe to import on client and server

export const recipeKeys = {
  all: ["recipes"] as const,
  lists: () => [...recipeKeys.all, "list"] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
  details: () => [...recipeKeys.all, "detail"] as const,
};

export const ingredientKeys = {
  all: ["ingredients"] as const,
  lists: () => [...ingredientKeys.all, "list"] as const,
  detail: (id: string) => [...ingredientKeys.details(), id] as const,
  details: () => [...ingredientKeys.all, "detail"] as const,
};

export const batchKeys = {
  all: ["batches"] as const,
  lists: () => [...batchKeys.all, "list"] as const,
  detail: (id: string) => [...batchKeys.details(), id] as const,
  details: () => [...batchKeys.all, "detail"] as const,
  byRecipe: (recipeId: string) => [...batchKeys.all, "byRecipe", recipeId] as const,
  recipeIngredients: (recipeId: string) =>
    [...batchKeys.all, "recipeIngredients", recipeId] as const,
};

export const batchUpdateKeys = {
  all: ["batchUpdates"] as const,
  lists: () => [...batchUpdateKeys.all, "list"] as const,
  byBatch: (batchId: string) => [...batchUpdateKeys.all, "byBatch", batchId] as const,
};
