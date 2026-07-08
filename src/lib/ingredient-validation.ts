import { z } from "zod";

export const INGREDIENT_TYPES = [
  "juice",
  "fruit",
  "sugar",
  "yeast",
  "hops",
  "spice",
  "other",
] as const;

export const ingredientSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().optional(),
  type: z.enum(INGREDIENT_TYPES).nullable().optional(),
});
