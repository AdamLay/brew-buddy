import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { z } from "zod";
import type { Ingredient as IngredientType } from "@/generated/prisma/client";

const INGREDIENT_TYPES = ["juice", "fruit", "sugar", "yeast", "hops", "spice", "other"] as const;

export const ingredientSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().optional(),
  type: z.enum(INGREDIENT_TYPES).nullable().optional(),
});

type IngredientFormData = z.infer<typeof ingredientSchema>;

interface IngredientFormProps {
  ingredient?: IngredientType | null;
  submitLabel?: string;
}

export function IngredientForm({
  ingredient,
  submitLabel = "Create Ingredient",
}: IngredientFormProps) {
  const form = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: ingredient?.name ?? "",
      description: ingredient?.description ?? "",
      type: ((ingredient?.type as (typeof INGREDIENT_TYPES)[number]) ?? "") || "",
    },
  });

  const { control, formState } = form;

  return (
    <div className="space-y-4">
      <div className="form-control w-full">
        <label className="label" htmlFor="ingredient-name">
          <span className="label-text required">Name *</span>
        </label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <>
              <input
                id="ingredient-name"
                {...field}
                type="text"
                placeholder="e.g. Granny Smith Apple"
                className={`input input-bordered w-full ${formState.errors.name ? "border-error" : ""}`}
              />
              {formState.errors.name && (
                <span className="text-error text-sm mt-1">{formState.errors.name.message}</span>
              )}
            </>
          )}
        />
      </div>

      <div className="form-control w-full">
        <label className="label" htmlFor="ingredient-type">
          <span className="label-text">Type</span>
        </label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <>
              <select
                id="ingredient-type"
                {...field}
                value={field.value ?? ""}
                className={`select select-bordered w-full ${formState.errors.type ? "border-error" : ""}`}
              >
                <option value="">Select type...</option>
                {INGREDIENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
              {formState.errors.type && (
                <span className="text-error text-sm mt-1">{formState.errors.type.message}</span>
              )}
            </>
          )}
        />
      </div>

      <div className="form-control w-full">
        <label className="label" htmlFor="ingredient-description">
          <span className="label-text">Description</span>
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <>
              <textarea
                id="ingredient-description"
                {...field}
                className={`textarea textarea-bordered h-24 ${formState.errors.description ? "border-error" : ""}`}
                placeholder="Optional description..."
              />
              {formState.errors.description && (
                <span className="text-error text-sm mt-1">
                  {formState.errors.description.message}
                </span>
              )}
            </>
          )}
        />
      </div>

      <button type="submit" className="btn btn-primary mt-4">
        {submitLabel}
      </button>
    </div>
  );
}
