import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { ingredientKeys as ik } from "@/lib/query-keys";

const fetchIngredients = createServerFn({ method: "GET" })
  .handler(async () => {
    const { prisma } = await import("@/lib/db");
    const ingredients = await prisma.ingredient.findMany({
      include: { _count: { select: { recipes: true } } },
    });
    return ingredients as any;
  });

export type IngredientWithCount = any & { _count: { recipes: number } };

export function useIngredients(): UseQueryResult<IngredientWithCount[], unknown> {
  return useQuery({
    queryKey: ik.lists(),
    queryFn: async () => fetchIngredients().then((r) => r.data),
  });
}
