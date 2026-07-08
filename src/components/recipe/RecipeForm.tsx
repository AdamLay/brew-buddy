import { recipeSchema } from "#/lib/recipes/recipe-validation.ts";
import { FormField } from "@/components/ui/FormFields";
import { useIngredients } from "@/lib/ingredients/use-ingredients";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Plus, Save, X } from "lucide-react";

export type Recipe = {
  id: string;
  name: string;
  description?: string | null;
  brewType: "CIDER" | "WINE" | "BEER" | "OTHER";
  instructions?: string | null;
  ingredients?: {
    id: string;
    amount: number;
    unit: string;
    notes: string | null;
    ingredientId: string;
  }[];
};

export type Ingredient = {
  id: string;
  name: string;
};

const BREW_TYPES = [
  { value: "CIDER", label: "Cider" },
  { value: "WINE", label: "Wine" },
  { value: "BEER", label: "Beer" },
  { value: "OTHER", label: "Other" },
] as const;

type FormValues = {
  name: string;
  description?: string;
  brewType: (typeof BREW_TYPES)[number]["value"];
  instructions?: string;
  ingredients: Array<{ ingredientId: string; amount: number; unit: string; notes?: string }>;
};

interface RecipeFormProps {
  recipe?: Recipe | null;
  onSubmit: (data: FormValues) => void | Promise<void>;
}

export function RecipeForm({ recipe, onSubmit }: RecipeFormProps) {
  const { data: ingredients } = useIngredients();
  const ingredientList: Ingredient[] = (ingredients ?? []) as Ingredient[];

  const [formIngredients, setFormIngredients] = useState<
    Array<{ ingredientId: string; amount: number; unit: string; notes: string }>
  >(
    recipe?.ingredients?.map((ing) => ({
      ingredientId: ing.ingredientId,
      amount: ing.amount,
      unit: ing.unit,
      notes: ing.notes ?? "",
    })) ?? [],
  );

  const addIngredient = () => {
    setFormIngredients([...formIngredients, { ingredientId: "", amount: 0, unit: "", notes: "" }]);
  };

  const removeIngredient = (index: number) => {
    setFormIngredients(formIngredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: string, value: string | number) => {
    const updated = [...formIngredients];
    if (field === "amount") {
      updated[index] = {
        ...updated[index],
        amount: typeof value === "number" ? value : parseFloat(value),
      };
    } else if (field === "notes") {
      updated[index] = { ...updated[index], notes: value as string };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setFormIngredients(updated);
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(recipeSchema as any),
    defaultValues: {
      name: recipe?.name ?? "",
      description: recipe?.description ?? undefined,
      brewType: ((recipe?.brewType as FormValues["brewType"]) ?? "CIDER") as FormValues["brewType"],
      instructions: recipe?.instructions ?? undefined,
      ingredients: formIngredients,
    },
  });

  // Sync defaultValues when formIngredients changes (e.g. after init from recipe)
  useEffect(() => {
    form.setValue("ingredients", formIngredients);
  }, [formIngredients, form]);

  const { control, formState } = form;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <FormField label="Name" htmlFor="recipe-name" required error={formState.errors.name}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                id="recipe-name"
                {...field}
                type="text"
                placeholder="e.g., Classic Apple Cider"
                className="input input-bordered w-full"
              />
            )}
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="recipe-description"
          error={formState.errors.description}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                id="recipe-description"
                {...field}
                placeholder="Brief description of this recipe..."
                rows={3}
                className="textarea textarea-bordered w-full"
              />
            )}
          />
        </FormField>

        <FormField
          label="Brew Type"
          htmlFor="recipe-brewType"
          required
          error={formState.errors.brewType}
        >
          <Controller
            name="brewType"
            control={control}
            render={({ field }) => (
              <select
                id="recipe-brewType"
                {...field}
                value={field.value ?? ""}
                className="select select-bordered w-full"
              >
                <option value="" disabled>
                  Select brew type...
                </option>
                {BREW_TYPES.map((bt) => (
                  <option key={bt.value} value={bt.value}>
                    {bt.label}
                  </option>
                ))}
              </select>
            )}
          />
        </FormField>

        <FormField
          label="Instructions"
          htmlFor="recipe-instructions"
          error={formState.errors.instructions}
        >
          <Controller
            name="instructions"
            control={control}
            render={({ field }) => (
              <textarea
                id="recipe-instructions"
                {...field}
                placeholder="Step-by-step brewing instructions..."
                rows={5}
                className="textarea textarea-bordered w-full"
              />
            )}
          />
        </FormField>

        <div className="divider text-base-content/50">Ingredients</div>

        <div className="space-y-4">
          {formIngredients.map((ing, index) => (
            <div
              key={index}
              className="card bg-base-200 p-4 space-y-3 relative border border-base-300"
            >
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="btn btn-ghost btn-sm text-error hover:bg-error/10 absolute top-2 right-2"
                title="Remove ingredient"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="form-control md:col-span-2">
                  <label className="label label-text font-medium required-column">Ingredient</label>
                  <select
                    value={ing.ingredientId}
                    onChange={(e) => updateIngredient(index, "ingredientId", e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select ingredient...</option>
                    {ingredientList.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label label-text font-medium required-column">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={ing.amount || ""}
                    onChange={(e) => updateIngredient(index, "amount", e.target.value)}
                    placeholder="e.g., 2"
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label label-text font-medium required-column">Unit</label>
                  <input
                    type="text"
                    value={ing.unit}
                    onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                    placeholder="e.g., kg, liters"
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label label-text font-medium">Notes</label>
                <input
                  type="text"
                  value={ing.notes}
                  onChange={(e) => updateIngredient(index, "notes", e.target.value)}
                  placeholder="Optional notes..."
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addIngredient}
            className="btn btn-outline w-fit btn-sm text-base-content/70 hover:text-base-content hover:border-base-content/40"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Ingredient
          </button>
        </div>

        <div className="flex gap-3 justify-end">
          {recipe ? (
            <a
              href={`/recipes/${recipe.id}/edit`}
              className="btn btn-ghost text-base-content/70 hover:text-base-content"
            >
              Cancel
            </a>
          ) : (
            <a
              href="/recipes"
              className="btn btn-ghost text-base-content/70 hover:text-base-content"
            >
              Cancel
            </a>
          )}
          <button type="submit" className="btn btn-primary">
            <Save className="w-4 h-4 mr-1" />
            {recipe ? "Update Recipe" : "Create Recipe"}
          </button>
        </div>
      </div>
    </form>
  );
}
