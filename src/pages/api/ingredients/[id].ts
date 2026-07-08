import { prisma } from "@/lib/db";
import { z } from "zod";

const ingredientSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().optional().nullable(),
  type: z.enum(["FRUIT", "SUGAR", "YEAST", "SPICE", "OTHER"]).optional().nullable(),
  defaultPrice: z.coerce.number().min(0).optional().nullable(),
});

// GET /api/ingredients/[id] - Get single ingredient
export function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return getIngredient(params);
}

// PUT /api/ingredients/[id] - Update ingredient
export function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return updateIngredient(request, params);
}

// DELETE /api/ingredients/[id] - Delete ingredient
export function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return deleteIngredient(params);
}

async function getIngredient(params: Promise<{ id: string }>) {
  const { id } = await params;
  const ingredient = await prisma.ingredient.findUnique({ where: { id } });
  if (!ingredient) {
    return new Response(JSON.stringify({ error: "NOT_FOUND" }), { status: 404 });
  }
  return new Response(JSON.stringify(ingredient), {
    headers: { "Content-Type": "application/json" },
  });
}

async function updateIngredient(request: Request, params: Promise<{ id: string }>) {
  const { id } = await params;
  const existing = await prisma.ingredient.findUnique({ where: { id } });
  if (!existing) {
    return new Response(JSON.stringify({ error: "NOT_FOUND" }), { status: 404 });
  }
  try {
    const body = await request.json();
    const data = ingredientSchema.parse(body);
    const result = await prisma.ingredient.update({
      where: { id },
      data,
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

async function deleteIngredient(params: Promise<{ id: string }>) {
  const { id } = await params;
  try {
    const ingredient = await prisma.ingredient.delete({ where: { id } });
    return new Response(JSON.stringify(ingredient), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    if (err?.code === "P2025") {
      return new Response(JSON.stringify({ error: "NOT_FOUND" }), { status: 404 });
    }
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
