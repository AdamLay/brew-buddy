import { prisma } from "@/lib/db";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ingredientSchema } from "./ingredient-validation";

export const createIngredientFn = createServerFn({ method: "POST" })
  .validator(ingredientSchema)
  .handler(async ({ data }) => {
    console.log("createIngredient called with data:", data);
    return await prisma.ingredient.create({ data });
  });

const updateIngredientValidator = z.object({ id: z.string(), data: ingredientSchema });

export const updateIngredientFn = createServerFn({ method: "POST" })
  .validator(updateIngredientValidator)
  .handler(async ({ data }) => {
    const existing = await prisma.ingredient.findUnique({ where: { id: data.id } });
    if (!existing) throw new Error("NOT_FOUND");
    return prisma.ingredient.update({ where: { id: data.id }, data: data.data });
  });

export const deleteIngredientFn = createServerFn({ method: "POST" })
  .validator(z.string())
  .handler(async ({ data }) => {
    try {
      return await prisma.ingredient.delete({ where: { id: data } });
    } catch (err) {
      if ((err as any).code === "P2025") throw new Error("NOT_FOUND");
      throw err;
    }
  });
