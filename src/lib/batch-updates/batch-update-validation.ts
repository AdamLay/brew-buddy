import { z } from "zod";

export const batchUpdateSchema = z.object({
  batchId: z.string().min(1, "Batch is required"),
  timestamp: z.coerce.date().optional(),
  notes: z.string().optional(),
  image: z.string().optional(),
});

export type BatchUpdateData = z.infer<typeof batchUpdateSchema>;
