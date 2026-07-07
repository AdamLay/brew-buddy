import { prisma } from "@/lib/db";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const errorSchema = z.object({
  error: z.string().optional(),
});

export const Route = createFileRoute("/ingredients/$id/edit")({
  component: EditIngredientPage,
  validateSearch: errorSchema,
  loader: async ({ params }: { params: { id: string } }) => {
    const ingredient = await prisma.ingredient.findUnique({
      where: { id: params.id },
    });
    if (!ingredient) {
      throw new Error("Ingredient not found");
    }
    return { ingredient };
  },
});

function EditIngredientPage() {
  const { ingredient } = Route.useLoaderData();
  const { error } = Route.useSearch();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <a href="/ingredients" className="btn btn-ghost btn-sm mb-4">
        &larr; Back to Ingredients
      </a>
      <h1 className="text-3xl font-bold mb-6">Edit Ingredient</h1>
      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <form action={`/api/ingredients/${ingredient.id}`} method="post">
            <input type="hidden" name="_method" value="update" />
            <IngredientForm action="" ingredient={ingredient} />
          </form>
        </div>
      </div>
    </div>
  );
}

function IngredientForm({ action, ingredient }: { action: string; ingredient: any }) {
  return (
    <div className="space-y-4">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text required">Name *</span>
        </label>
        <input
          name="name"
          type="text"
          defaultValue={ingredient.name}
          placeholder="e.g. Granny Smith Apple"
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Type</span>
        </label>
        <select name="type" defaultValue={ingredient.type || ""} className="select select-bordered w-full">
          <option value="">Select type...</option>
          <option value="fruit">Fruit</option>
          <option value="sugar">Sugar / Sweetener</option>
          <option value="yeast">Yeast</option>
          <option value="hops">Hops</option>
          <option value="spice">Spice / Herb</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          name="description"
          defaultValue={ingredient.description || ""}
          className="textarea textarea-bordered h-24"
          placeholder="Optional description..."
        />
      </div>

      <button className="btn btn-primary mt-4">Update Ingredient</button>
    </div>
  );
}
