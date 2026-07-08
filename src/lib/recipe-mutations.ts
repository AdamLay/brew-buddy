import { createServerFn } from "@tanstack/react-start";

export const createRecipe = createServerFn({ method: "POST" })
  .handler(async (ctx) => {
    const { prisma } = await import("@/lib/db");
    return await prisma.recipe.create({ data: ctx.data as any });
  });

export const updateRecipe = createServerFn({ method: "POST" })
  .handler(async (ctx) => {
    const { id, data } = ctx.data as unknown as { id: string; data: Record<string, unknown> };
    const { prisma } = await import("@/lib/db");
    const existing = await prisma.recipe.findUnique({ where: { id } });
    if (!existing) throw new Error("NOT_FOUND");
    return prisma.recipe.update({ where: { id }, data });
  });

export const deleteRecipe = createServerFn({ method: "POST" })
  .handler(async (ctx) => {
    const id = ctx.data as unknown as string;
    const { prisma } = await import("@/lib/db");
    try {
      return await prisma.recipe.delete({ where: { id } });
    } catch (err) {
      if ((err as any).code === "P2025") throw new Error("NOT_FOUND");
      throw err;
    }
  });
