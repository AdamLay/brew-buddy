import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { recipeKeys as rk } from "@/lib/query-keys";

const fetchRecipes = createServerFn({ method: "GET" })
  .handler(async () => {
    const { prisma } = await import("@/lib/db");
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
    queryFn: async () => fetchRecipes().then((r) => r.data),
  });
}
