import { FormField } from "@/components/ui/FormFields";
import { BATCH_STATUSES, batchSchema } from "@/lib/batches/batch-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Beaker, Save } from "lucide-react";

export type Batch = {
  id: string;
  recipeId: string;
  startDate?: Date | null;
  endDate?: Date | null;
  status: (typeof BATCH_STATUSES)[number];
  notes?: string | null;
  batchSize?: number | null;
  ogReading?: number | null;
  fgReading?: number | null;
  currentGravity?: number | null;
};

type FormValues = {
  recipeId: string;
  startDate?: Date;
  endDate?: Date | null;
  status: (typeof BATCH_STATUSES)[number];
  notes?: string;
  batchSize?: number;
  ogReading?: number;
  fgReading?: number;
  currentGravity?: number;
};

interface BatchFormProps {
  batch?: Batch | null;
  recipes: { id: string; name: string }[];
  submitLabel?: string;
  onSubmit: (data: FormValues) => void | Promise<void>;
}

export function BatchForm({
  batch,
  recipes,
  submitLabel = "Create Batch",
  onSubmit,
}: BatchFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(batchSchema as any),
    defaultValues: {
      recipeId: batch?.recipeId ?? "",
      startDate: batch?.startDate ? new Date(batch.startDate) : undefined,
      endDate: batch?.endDate ? new Date(batch.endDate) : null,
      status: (batch?.status as (typeof BATCH_STATUSES)[number]) ?? "PLANNING",
      notes: batch?.notes ?? "",
      batchSize: batch?.batchSize ?? undefined,
      ogReading: batch?.ogReading ?? undefined,
      fgReading: batch?.fgReading ?? undefined,
      currentGravity: batch?.currentGravity ?? undefined,
    },
  });

  const { control, formState } = form;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <FormField label="Recipe" htmlFor="batch-recipe" required error={formState.errors.recipeId}>
          <Controller
            name="recipeId"
            control={control}
            render={({ field }) => (
              <select id="batch-recipe" {...field} className="select select-bordered w-full">
                <option value="">Select a recipe...</option>
                {recipes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            )}
          />
        </FormField>

        <FormField label="Status" htmlFor="batch-status" error={formState.errors.status}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select id="batch-status" {...field} className="select select-bordered w-full">
                {BATCH_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            )}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start Date" htmlFor="batch-start-date">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <input
                  id="batch-start-date"
                  {...field}
                  type="date"
                  value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                  onChange={(e) => {
                    field.onChange(e.target.value ? new Date(e.target.value) : null);
                  }}
                  className="input input-bordered w-full"
                />
              )}
            />
          </FormField>

          <FormField label="End Date" htmlFor="batch-end-date">
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <input
                  id="batch-end-date"
                  {...field}
                  type="date"
                  className="input input-bordered w-full"
                  value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                />
              )}
            />
          </FormField>
        </div>

        <FormField label="Batch Size (liters)" htmlFor="batch-size">
          <Controller
            name="batchSize"
            control={control}
            render={({ field }) => (
              <input
                id="batch-size"
                {...field}
                type="number"
                step="0.1"
                min="0.1"
                placeholder="e.g. 5"
                className="input input-bordered w-full"
              />
            )}
          />
        </FormField>

        <div className="divider pt-0">
          <span className="text-sm text-base-content/60">Gravity Readings</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField label="OG" htmlFor="batch-og">
            <Controller
              name="ogReading"
              control={control}
              render={({ field }) => (
                <input
                  id="batch-og"
                  {...field}
                  type="number"
                  step="0.001"
                  placeholder="1.050"
                  className="input input-bordered w-full"
                />
              )}
            />
          </FormField>

          <FormField label="FG" htmlFor="batch-fg">
            <Controller
              name="fgReading"
              control={control}
              render={({ field }) => (
                <input
                  id="batch-fg"
                  {...field}
                  type="number"
                  step="0.001"
                  placeholder="1.010"
                  className="input input-bordered w-full"
                />
              )}
            />
          </FormField>

          <FormField label="Current" htmlFor="batch-current">
            <Controller
              name="currentGravity"
              control={control}
              render={({ field }) => (
                <input
                  id="batch-current"
                  {...field}
                  type="number"
                  step="0.001"
                  placeholder="— "
                  className="input input-bordered w-full"
                />
              )}
            />
          </FormField>
        </div>

        <FormField label="Notes" htmlFor="batch-notes">
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <textarea
                id="batch-notes"
                {...field}
                className="textarea textarea-bordered w-full h-24"
                placeholder="Optional notes about this batch..."
              />
            )}
          />
        </FormField>

        <button type="submit" className="btn btn-primary mt-4">
          {submitLabel.includes("Create") ? (
            <>
              <Beaker className="w-4 h-4 mr-1" />
              {submitLabel}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-1" />
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
