import { prisma } from "@/lib/db";

// GET /api/recipes/[id]/ingredients - Get recipe ingredients
export function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return getRecipeIngredients(params);
}

async function getRecipeIngredients(params: Promise<{ id: string }>) {
  const { id } = await params;
  const ingredients = await prisma.recipeIngredient.findMany({
    where: { recipeId: id },
    include: {
      ingredient: { select: { id: true, name: true, defaultPrice: true } },
    },
    orderBy: { ingredient: { name: "asc" } },
  });
  return new Response(JSON.stringify(ingredients), {
    headers: { "Content-Type": "application/json" },
  });
}
