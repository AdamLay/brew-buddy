import { INGREDIENT_TYPES, ingredientSchema } from "#/lib/ingredients/ingredient-validation";
import { FormField } from "@/components/ui/FormFields";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Save, Sprout } from "lucide-react";

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
        <FormField label="Name" htmlFor="ingredient-name" required error={formState.errors.name}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                id="ingredient-name"
                {...field}
                type="text"
                placeholder="e.g. Granny Smith Apple"
                className="input input-bordered w-full"
              />
            )}
          />
        </FormField>

        <FormField label="Type" htmlFor="ingredient-type" error={formState.errors.type}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <select
                id="ingredient-type"
                {...field}
                value={field.value ?? ""}
                className="select select-bordered w-full"
              >
                <option value="">Select type...</option>
                {INGREDIENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            )}
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="ingredient-description"
          error={formState.errors.description}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                id="ingredient-description"
                {...field}
                className="textarea textarea-bordered w-full h-24"
                placeholder="Optional description..."
                value={field.value ?? ""}
              />
            )}
          />
        </FormField>

        <button type="submit" className="btn btn-primary mt-4">
          {submitLabel === "Create Ingredient" ? (
            <>
              <Sprout className="w-4 h-4 mr-1" />
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
