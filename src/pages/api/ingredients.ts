import { prisma } from "@/lib/db";
import { z } from "zod";

const ingredientSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().optional().nullable(),
  type: z.enum(["FRUIT", "SUGAR", "YEAST", "SPICE", "OTHER"]).optional().nullable(),
  defaultPrice: z.coerce.number().min(0).optional().nullable(),
});

// GET /api/ingredients - List all ingredients
export function GET() {
  return fetchIngredients();
}

// POST /api/ingredients - Create ingredient
export function POST(request: Request) {
  return createIngredient(request);
}

async function fetchIngredients() {
  try {
    const ingredients = await prisma.ingredient.findMany({
      include: { _count: { select: { recipes: true } } },
      orderBy: { name: "asc" },
    });
    return new Response(JSON.stringify(ingredients), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function createIngredient(request: Request) {
  try {
    const body = await request.json();
    const data = ingredientSchema.parse(body);
    const result = await prisma.ingredient.create({ data });
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
