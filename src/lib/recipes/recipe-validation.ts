import { z } from "zod";

export const recipeIngredientSchema = z.object({
  ingredientId: z.string().min(1, "Ingredient is required"),
  amount: z.coerce.number().positive(),
  unit: z.string().min(1, "Unit is required"),
  notes: z.string().optional(),
});

export const recipeSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().optional(),
  brewType: z.enum(["CIDER", "WINE", "BEER", "OTHER"]),
  originalGravity: z.coerce.number().positive().nullish(),
  finalGravity: z.coerce.number().positive().nullish(),
  batchSize: z.coerce.number().positive().nullish(),
  instructions: z.string().optional(),
  ingredients: z.array(recipeIngredientSchema).default([]),
});

export type RecipeData = z.infer<typeof recipeSchema>;
