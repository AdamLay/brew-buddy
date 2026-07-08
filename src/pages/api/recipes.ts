import { prisma } from "@/lib/db";
import { z } from "zod";

const recipeSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().optional().nullable(),
  brewType: z.enum(["CIDER", "WINE", "BEER", "OTHER"]),
  instructions: z.string().optional().nullable(),
  ingredients: z
    .array(
      z.object({
        ingredientId: z.string(),
        amount: z.number(),
        unit: z.string(),
        notes: z.string().optional().nullable(),
      })
    )
    .optional(),
});

// GET /api/recipes - List all recipes
export function GET() {
  return fetchRecipes();
}

// POST /api/recipes - Create recipe
export function POST(request: Request) {
  return createRecipe(request);
}

async function fetchRecipes() {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { batches: true } },
        ingredients: { include: { ingredient: true } },
      },
    });
    return new Response(JSON.stringify(recipes), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function createRecipe(request: Request) {
  try {
    const body = await request.json();
    const data = recipeSchema.parse(body);
    const { ingredients, ...recipeData } = data;

    const result = await prisma.$transaction(async (tx) => {
      const recipe = await tx.recipe.create({ data: recipeData });
      if (ingredients?.length) {
        await tx.recipeIngredient.createMany({
          data: ingredients.map((ing) => ({ ...ing, recipeId: recipe.id })),
        });
      }
      return tx.recipe.findUnique({
        where: { id: recipe.id },
        include: { ingredients: { include: { ingredient: true } } },
      });
    });

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: err.issues?.[0]?.message ?? "Validation failed" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
