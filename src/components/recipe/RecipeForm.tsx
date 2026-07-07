import { type Recipe } from "@/generated/prisma/client";

const BREW_TYPES = [
  { value: "CIDER", label: "Cider" },
  { value: "WINE", label: "Wine" },
  { value: "BEER", label: "Beer" },
  { value: "OTHER", label: "Other" },
] as const;

interface RecipeFormProps {
  action: string;
  recipe?: Recipe | null;
}

export function RecipeForm({ action, recipe }: RecipeFormProps) {
  return (
    <form action={action} method="post" className="space-y-6">
      <div className="form-control w-full">
        <label className="label" htmlFor="name">
          <span className="label-text font-medium required-column">Name</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={recipe?.name ?? ""}
          placeholder="e.g., Classic Apple Cider"
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control w-full">
        <label className="label" htmlFor="description">
          <span className="label-text font-medium">Description</span>
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={recipe?.description ?? ""}
          placeholder="Brief description of this recipe..."
          className="textarea textarea-bordered h-24"
        />
      </div>

      <div className="form-control w-full lg:w-1/2">
        <label className="label" htmlFor="brewType">
          <span className="label-text font-medium required-column">Brew Type</span>
        </label>
        <select
          id="brewType"
          name="brewType"
          defaultValue={recipe?.brewType ?? ""}
          className="select select-bordered w-full"
          required
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="form-control w-full">
          <label className="label" htmlFor="originalGravity">
            <span className="label-text font-medium">Original Gravity</span>
          </label>
          <input
            type="number"
            step="0.001"
            id="originalGravity"
            name="originalGravity"
            defaultValue={recipe?.originalGravity ?? ""}
            placeholder="e.g., 1.050"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control w-full">
          <label className="label" htmlFor="finalGravity">
            <span className="label-text font-medium">Final Gravity</span>
          </label>
          <input
            type="number"
            step="0.001"
            id="finalGravity"
            name="finalGravity"
            defaultValue={recipe?.finalGravity ?? ""}
            placeholder="e.g., 1.010"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control w-full">
          <label className="label" htmlFor="batchSize">
            <span className="label-text font-medium">Batch Size (L)</span>
          </label>
          <input
            type="number"
            step="0.1"
            id="batchSize"
            name="batchSize"
            defaultValue={recipe?.batchSize ?? ""}
            placeholder="e.g., 20"
            className="input input-bordered w-full"
          />
        </div>
      </div>

      <div className="form-control w-full">
        <label className="label" htmlFor="instructions">
          <span className="label-text font-medium">Instructions</span>
        </label>
        <textarea
          id="instructions"
          name="instructions"
          defaultValue={recipe?.instructions ?? ""}
          placeholder="Step-by-step brewing instructions..."
          className="textarea textarea-bordered h-40"
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
    </form>
  );
}
