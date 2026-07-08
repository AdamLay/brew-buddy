import { z } from "zod";

export const BATCH_STATUSES = [
  "PLANNING",
  "FERMENTING",
  "CONDITIONING",
  "BOTTLED",
  "COMPLETE",
] as const;

export const batchSchema = z.object({
  recipeId: z.string().min(1, "Recipe is required"),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().nullable().optional(),
  status: z.enum(BATCH_STATUSES).default("PLANNING"),
  notes: z.string().optional(),
  batchSize: z.coerce.number().positive().min(0.1).optional().nullable(),
  ogReading: z.coerce.number().min(0.9).max(1.3).optional().nullable(),
  fgReading: z.coerce.number().min(0.9).max(1.1).optional().nullable(),
  currentGravity: z.coerce.number().min(0.9).max(1.3).optional().nullable(),
});

export type BatchData = z.infer<typeof batchSchema>;
