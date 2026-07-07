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

export function parseIngredientFormData(formData: FormData) {
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || undefined;
  const type = (formData.get("type") as string) || undefined;

  return {
    name,
    description: description || null,
    type: type || null,
  };
}
