import { prisma } from "@/lib/db";
import { recipeKeys as rk } from "@/lib/query-keys";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

const fetchRecipesFn = createServerFn({ method: "GET" }).handler(async () => {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { batches: true } } },
  });
  return recipes as any;
});

export type RecipeWithCount = any & { _count: { batches: number } };

export function useRecipes(): UseQueryResult<RecipeWithCount[], unknown> {
  return useQuery({
    queryKey: rk.lists(),
    queryFn: async () => fetchRecipesFn().then((r) => r.data),
  });
}
