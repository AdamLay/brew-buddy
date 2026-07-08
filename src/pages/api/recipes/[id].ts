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

// GET /api/recipes/[id] - Get single recipe
export function GET({ params }: { params: Promise<{ id: string }> }) {
  return getRecipe(params);
}

// PUT /api/recipes/[id] - Update recipe
export function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return updateRecipe(request, params);
}

// DELETE /api/recipes/[id] - Delete recipe
export function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return deleteRecipe(params);
}

async function getRecipe(params: Promise<{ id: string }>) {
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: { ingredients: { include: { ingredient: true } } },
  });
  if (!recipe) {
    return new Response(JSON.stringify({ error: "NOT_FOUND" }), { status: 404 });
  }
  return new Response(JSON.stringify(recipe), {
    headers: { "Content-Type": "application/json" },
  });
}

async function updateRecipe(request: Request, params: Promise<{ id: string }>) {
  const { id } = await params;
  const existing = await prisma.recipe.findUnique({ where: { id } });
  if (!existing) {
    return new Response(JSON.stringify({ error: "NOT_FOUND" }), { status: 404 });
  }
  try {
    const body = await request.json();
    const data = recipeSchema.parse(body);
    const { ingredients, ...recipeData } = data;

    const result = await prisma.$transaction(async (tx) => {
      await tx.recipeIngredient.deleteMany({ where: { recipeId: id } });
      if (ingredients?.length) {
        await tx.recipeIngredient.createMany({
          data: ingredients.map((ing) => ({ ...ing, recipeId: id })),
        });
      }
      return tx.recipe.update({
        where: { id },
        data: recipeData,
        include: { ingredients: { include: { ingredient: true } } },
      });
    });

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: err.issues?.[0]?.message ?? "Validation failed" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}

async function deleteRecipe(params: Promise<{ id: string }>) {
  const { id } = await params;
  try {
    const recipe = await prisma.recipe.delete({ where: { id } });
    return new Response(JSON.stringify(recipe), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    if (err?.code === "P2025") {
      return new Response(JSON.stringify({ error: "NOT_FOUND" }), { status: 404 });
    }
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
