import { prisma } from "@/lib/db";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { recipeSchema } from "./recipe-validation";

export const createRecipeFn = createServerFn({ method: "POST" })
  .validator(recipeSchema)
  .handler(async ({ data }) => {
    return await prisma.recipe.create({ data });
  });

const updateRecipeValidator = z.object({ id: z.string(), data: recipeSchema });

export const updateRecipeFn = createServerFn({ method: "POST" })
  .validator(updateRecipeValidator)
  .handler(async ({ data }) => {
    const existing = await prisma.recipe.findUnique({ where: { id: data.id } });
    if (!existing) throw new Error("NOT_FOUND");
    return prisma.recipe.update({ where: { id: data.id }, data: data.data });
  });

export const deleteRecipeFn = createServerFn({ method: "POST" })
  .validator(z.string())
  .handler(async ({ data }) => {
    try {
      return await prisma.recipe.delete({ where: { id: data } });
    } catch (err) {
      if ((err as any).code === "P2025") throw new Error("NOT_FOUND");
      throw err;
    }
  });
