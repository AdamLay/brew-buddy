import { prisma } from "@/lib/db";
import { ingredientKeys as ik } from "@/lib/query-keys";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

const fetchIngredientsFn = createServerFn({ method: "GET" }).handler(async () => {
  const ingredients = await prisma.ingredient.findMany({
    include: { _count: { select: { recipes: true } } },
  });
  return ingredients as any;
});

export type IngredientWithCount = any & { _count: { recipes: number } };

export function useIngredients(): UseQueryResult<IngredientWithCount[], unknown> {
  return useQuery({
    queryKey: ik.lists(),
    queryFn: async () => fetchIngredientsFn().then((r) => r.data),
  });
}
