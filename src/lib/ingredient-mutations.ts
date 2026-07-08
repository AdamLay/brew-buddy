import { prisma } from "@/lib/db";
import { createServerFn } from "@tanstack/react-start";

export const createIngredientFn = createServerFn({ method: "POST" }).handler(async (ctx) => {
  console.log("createIngredient called with data:", ctx.data);
  return await prisma.ingredient.create({ data: ctx.data as any });
});

export const updateIngredientFn = createServerFn({ method: "POST" }).handler(async (ctx) => {
  const { id, data } = ctx.data as unknown as { id: string; data: Record<string, unknown> };
  const existing = await prisma.ingredient.findUnique({ where: { id } });
  if (!existing) throw new Error("NOT_FOUND");
  return prisma.ingredient.update({ where: { id }, data });
});

export const deleteIngredientFn = createServerFn({ method: "POST" }).handler(async (ctx) => {
  const id = ctx.data as unknown as string;
  try {
    return await prisma.ingredient.delete({ where: { id } });
  } catch (err) {
    if ((err as any).code === "P2025") throw new Error("NOT_FOUND");
    throw err;
  }
});
