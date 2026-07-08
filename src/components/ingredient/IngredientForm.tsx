import { INGREDIENT_TYPES, ingredientSchema } from "#/lib/ingredients/ingredient-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

export type Ingredient = {
  id: string;
  name: string;
  description?: string | null;
  type?: string | null;
};

type FormValues = {
  name: string;
  description?: string;
  type?: (typeof INGREDIENT_TYPES)[number] | null;
};

interface IngredientFormProps {
  ingredient?: Ingredient | null;
  submitLabel?: string;
  onSubmit: (data: FormValues) => void | Promise<void>;
}

export function IngredientForm({
  ingredient,
  submitLabel = "Create Ingredient",
  onSubmit,
}: IngredientFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(ingredientSchema as any),
    defaultValues: {
      name: ingredient?.name ?? "",
      description: ingredient?.description ?? "",
      type: ((ingredient?.type as (typeof INGREDIENT_TYPES)[number]) ?? "") || "",
    },
  });

  const { control, formState } = form;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  value={field.value ?? ""}
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
    </form>
  );
}
