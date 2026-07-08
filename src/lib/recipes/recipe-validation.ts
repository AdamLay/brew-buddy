import { z } from "zod";

export const recipeSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().optional(),
  brewType: z.enum(["CIDER", "WINE", "BEER", "OTHER"]),
  originalGravity: z.coerce.number().positive().nullish(),
  finalGravity: z.coerce.number().positive().nullish(),
  batchSize: z.coerce.number().positive().nullish(),
  instructions: z.string().optional(),
});

export type RecipeData = z.infer<typeof recipeSchema>;
