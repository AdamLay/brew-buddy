import { prisma } from "@/lib/db";
import { z } from "zod";

const batchUpdateSchema = z.object({
  batchId: z.string(),
  timestamp: z.coerce.date().optional(),
  notes: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

const batchSchema = z.object({
  recipeId: z.string().min(1, "Recipe is required").optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  status: z.enum(["PLANNING", "FERMENTING", "CONDITIONING", "BOTTLED", "COMPLETE"]).optional(),
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

// GET /api/batches/[id] - Get batch detail
export function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return getBatch(params);
}

// PUT /api/batches/[id] - Update batch
export function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return updateBatch(request, params);
}

// DELETE /api/batches/[id] - Delete batch
export function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return deleteBatch(params);
}

async function getBatch(params: Promise<{ id: string }>) {
  const { id } = await params;
  const batch = await prisma.batch.findUnique({
    where: { id },
    include: {
      recipe: { select: { id: true, name: true, brewType: true } },
      ingredients: {
        include: {
          ingredient: { select: { name: true, defaultPrice: true } },
          recipeIngredient: { select: { amount: true, unit: true } },
        },
      },
    },
  });
  if (!batch) {
    return new Response(JSON.stringify({ error: "NOT_FOUND" }), { status: 404 });
  }
  return new Response(JSON.stringify(batch), {
    headers: { "Content-Type": "application/json" },
  });
}

async function updateBatch(request: Request, params: Promise<{ id: string }>) {
  const { id } = await params;
  const existing = await prisma.batch.findUnique({
    where: { id },
    include: { recipe: { select: { name: true, brewType: true } } },
  });
  if (!existing) {
    return new Response(JSON.stringify({ error: "NOT_FOUND" }), { status: 404 });
  }

  try {
    const body = await request.json();
    const data = batchSchema.parse(body);

    // Auto-set endDate when status changes away from PLANNING/FERMENTING
    let endDate = data.endDate;
    if (data.status && !["PLANNING", "FERMENTING"].includes(data.status)) {
      endDate = new Date();
    }

    const { ingredients, recipeId, ...batchUpdate } = data as any;

    const { notes, startDate, status, ogReading, fgReading, currentGravity, batchSize, ...batchData } = batchUpdate;

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

    if (!ingredients || ingredients.length === 0) {
      const updated = await prisma.batch.update({
        where: { id },
        data: { ...batchData, endDate },
        include,
      });
      return new Response(JSON.stringify(updated), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const fetchRecipeId = data.recipeId || existing.recipeId;
    const recipeIngredientIds = ingredients.map((ing: any) => ing.recipeIngredientId);
    const recipeIngredients = await prisma.recipeIngredient.findMany({
      where: {
        id: { in: recipeIngredientIds },
        recipeId: fetchRecipeId,
      },
      select: {
        id: true,
        amount: true,
        unit: true,
        ingredientId: true,
      },
    });

    const riMap = new Map(recipeIngredients.map((ri) => [ri.id, ri]));

    const batchIngredients = ingredients.map((ing: any) => {
      const ri = riMap.get(ing.recipeIngredientId);
      return {
        batchId: id,
        recipeIngredientId: ing.recipeIngredientId,
        ingredientId: ri?.ingredientId ?? "",
        amount: ri?.amount ?? 0,
        unit: ri?.unit ?? "",
        price: ing.priceOverride,
      };
    });

    const result = await prisma.$transaction(async (tx) => {
      await tx.batch.update({
        where: { id },
        data: { ...batchData, endDate },
      });
      await tx.batchIngredient.deleteMany({ where: { batchId: id } });
      if (batchIngredients.length > 0) {
        await tx.batchIngredient.createMany({
          data: batchIngredients,
        });
      }
      return tx.batch.findUnique({
        where: { id },
        include,
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

async function deleteBatch(params: Promise<{ id: string }>) {
  const { id } = await params;
  try {
    const batch = await prisma.batch.delete({ where: { id } });
    return new Response(JSON.stringify(batch), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    if (err?.code === "P2025") {
      return new Response(JSON.stringify({ error: "NOT_FOUND" }), { status: 404 });
    }
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
