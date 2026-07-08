import { prisma } from "@/lib/db";
import { z } from "zod";

const batchSchema = z.object({
  recipeId: z.string().min(1, "Recipe is required"),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  status: z.enum(["PLANNING", "FERMENTING", "CONDITIONING", "BOTTLED", "COMPLETE"]).default("PLANNING"),
  notes: z.string().optional().nullable(),
  batchSize: z.number().optional().nullable(),
  ogReading: z.number().optional().nullable(),
  fgReading: z.number().optional().nullable(),
  currentGravity: z.number().optional().nullable(),
  ingredients: z
    .array(
      z.object({
        recipeIngredientId: z.string(),
        priceOverride: z.number().nullish(),
      })
    )
    .optional(),
});

// GET /api/batches - List all batches
export function GET() {
  return fetchBatches();
}

// POST /api/batches - Create batch
export function POST(request: Request) {
  return createBatch(request);
}

async function fetchBatches() {
  try {
    const batches = await prisma.batch.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        recipe: { select: { name: true, brewType: true } },
        ingredients: {
          include: {
            ingredient: { select: { name: true } },
            recipeIngredient: { select: { amount: true, unit: true } },
          },
        },
      },
    });
    return new Response(JSON.stringify(batches), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function createBatch(request: Request) {
  try {
    const body = await request.json();
    const data = batchSchema.parse(body);
    const { ingredients, ...batchData } = data;

    const include = {
      recipe: { select: { name: true, brewType: true } },
      ingredients: {
        include: {
          ingredient: { select: { name: true, defaultPrice: true } },
          recipeIngredient: {
            select: { amount: true, unit: true, ingredientId: true },
          },
        },
      },
    };

    if (ingredients && ingredients.length > 0) {
      const recipeIngredientIds = ingredients.map((ing) => ing.recipeIngredientId);
      const recipeIngredients = await prisma.recipeIngredient.findMany({
        where: {
          id: { in: recipeIngredientIds },
          recipeId: data.recipeId,
        },
        select: {
          id: true,
          amount: true,
          unit: true,
          ingredientId: true,
        },
      });

      const riMap = new Map(recipeIngredients.map((ri) => [ri.id, ri]));

      const batchIngredients = ingredients.map((ing) => {
        const ri = riMap.get(ing.recipeIngredientId);
        return {
          recipeIngredientId: ing.recipeIngredientId,
          ingredientId: ri?.ingredientId ?? "",
          amount: ri?.amount ?? 0,
          unit: ri?.unit ?? "",
          price: ing.priceOverride,
        };
      });

      const created = await prisma.$transaction(async (tx) => {
        const batch = await tx.batch.create({
          data: {
            ...(batchData as any),
            ingredients: {
              create: batchIngredients,
            },
          },
          include,
        });
        return batch;
      });

      return new Response(JSON.stringify(created), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    const created = await prisma.batch.create({
      data: batchData as any,
      include,
    });

    return new Response(JSON.stringify(created), {
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
