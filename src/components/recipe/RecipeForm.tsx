import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { type Recipe } from "@/generated/prisma/client";
import { recipeSchema } from "@/lib/recipe-validation";

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
  originalGravity?: number | null;
  finalGravity?: number | null;
  batchSize?: number | null;
  instructions?: string;
};

interface RecipeFormProps {
  recipe?: Recipe | null;
}

export function RecipeForm({ recipe }: RecipeFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(recipeSchema as any),
    defaultValues: {
      name: recipe?.name ?? "",
      description: recipe?.description ?? undefined,
      brewType: ((recipe?.brewType as FormValues["brewType"]) ?? "CIDER") as FormValues["brewType"],
      originalGravity: recipe?.originalGravity ?? undefined,
      finalGravity: recipe?.finalGravity ?? undefined,
      batchSize: recipe?.batchSize ?? undefined,
      instructions: recipe?.instructions ?? undefined,
    },
  });

  const { control, formState } = form;

  return (
    <div className="space-y-6">
      <div className="form-control w-full">
        <label className="label" htmlFor="recipe-name">
          <span className="label-text font-medium required-column">Name</span>
        </label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <>
              <input
                id="recipe-name"
                {...field}
                type="text"
                placeholder="e.g., Classic Apple Cider"
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
        <label className="label" htmlFor="recipe-description">
          <span className="label-text font-medium">Description</span>
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <>
              <textarea
                id="recipe-description"
                {...field}
                placeholder="Brief description of this recipe..."
                className={`textarea textarea-bordered h-24 ${formState.errors.description ? "border-error" : ""}`}
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

      <div className="form-control w-full lg:w-1/2">
        <label className="label" htmlFor="recipe-brewType">
          <span className="label-text font-medium required-column">Brew Type</span>
        </label>
        <Controller
          name="brewType"
          control={control}
          render={({ field }) => (
            <>
              <select
                id="recipe-brewType"
                {...field}
                value={field.value ?? ""}
                className={`select select-bordered w-full ${formState.errors.brewType ? "border-error" : ""}`}
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
              {formState.errors.brewType && (
                <span className="text-error text-sm mt-1">{formState.errors.brewType.message}</span>
              )}
            </>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="form-control w-full">
          <label className="label" htmlFor="recipe-originalGravity">
            <span className="label-text font-medium">Original Gravity</span>
          </label>
          <Controller
            name="originalGravity"
            control={control}
            render={({ field }) => (
              <>
                <input
                  id="recipe-originalGravity"
                  {...field}
                  type="number"
                  step="0.001"
                  placeholder="e.g., 1.050"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const v = e.target.value === "" ? null : parseFloat(e.target.value);
                    field.onChange(v);
                  }}
                  className={`input input-bordered w-full ${formState.errors.originalGravity ? "border-error" : ""}`}
                />
                {formState.errors.originalGravity && (
                  <span className="text-error text-sm mt-1">
                    {formState.errors.originalGravity.message}
                  </span>
                )}
              </>
            )}
          />
        </div>

        <div className="form-control w-full">
          <label className="label" htmlFor="recipe-finalGravity">
            <span className="label-text font-medium">Final Gravity</span>
          </label>
          <Controller
            name="finalGravity"
            control={control}
            render={({ field }) => (
              <>
                <input
                  id="recipe-finalGravity"
                  {...field}
                  type="number"
                  step="0.001"
                  placeholder="e.g., 1.010"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const v = e.target.value === "" ? null : parseFloat(e.target.value);
                    field.onChange(v);
                  }}
                  className={`input input-bordered w-full ${formState.errors.finalGravity ? "border-error" : ""}`}
                />
                {formState.errors.finalGravity && (
                  <span className="text-error text-sm mt-1">
                    {formState.errors.finalGravity.message}
                  </span>
                )}
              </>
            )}
          />
        </div>

        <div className="form-control w-full">
          <label className="label" htmlFor="recipe-batchSize">
            <span className="label-text font-medium">Batch Size (L)</span>
          </label>
          <Controller
            name="batchSize"
            control={control}
            render={({ field }) => (
              <>
                <input
                  id="recipe-batchSize"
                  {...field}
                  type="number"
                  step="0.1"
                  placeholder="e.g., 20"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const v = e.target.value === "" ? null : parseFloat(e.target.value);
                    field.onChange(v);
                  }}
                  className={`input input-bordered w-full ${formState.errors.batchSize ? "border-error" : ""}`}
                />
                {formState.errors.batchSize && (
                  <span className="text-error text-sm mt-1">
                    {formState.errors.batchSize.message}
                  </span>
                )}
              </>
            )}
          />
        </div>
      </div>

      <div className="form-control w-full">
        <label className="label" htmlFor="recipe-instructions">
          <span className="label-text font-medium">Instructions</span>
        </label>
        <Controller
          name="instructions"
          control={control}
          render={({ field }) => (
            <>
              <textarea
                id="recipe-instructions"
                {...field}
                placeholder="Step-by-step brewing instructions..."
                className={`textarea textarea-bordered h-40 ${formState.errors.instructions ? "border-error" : ""}`}
              />
              {formState.errors.instructions && (
                <span className="text-error text-sm mt-1">
                  {formState.errors.instructions.message}
                </span>
              )}
            </>
          )}
        />
      </div>

      <div className="flex gap-3 justify-end">
        <a href={recipe ? `/recipes/${recipe.id}/edit` : "/recipes"} className="btn btn-ghost">
          Cancel
        </a>
        <button type="submit" className="btn btn-primary">
          {recipe ? "Update Recipe" : "Create Recipe"}
        </button>
      </div>
    </div>
  );
}
