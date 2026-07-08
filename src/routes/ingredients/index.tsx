import { useDeleteIngredient, useIngredients } from "#/lib/ingredients/use-ingredients";
import { ingredientKeys as ik } from "@/lib/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/ingredients/")({
  component: IngredientsPage,
});

function IngredientsPage() {
  const queryClient = useQueryClient();
  const { data: ingredients, isLoading } = useIngredients();
  const deleteMutation = useDeleteIngredient(() => {
    queryClient.invalidateQueries({ queryKey: ik.lists() });
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-base-content">Ingredients</h1>
        <Link to="/ingredients/new" className="btn btn-primary">
          <Plus className="w-4 h-4 mr-1" />
          New Ingredient
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : !ingredients || ingredients.length === 0 ? (
        <div className="text-center py-16 bg-base-100 rounded-xl border border-base-300">
          <p className="text-base-content/60 text-lg mb-4">
            No ingredients yet. Create your first ingredient!
          </p>
          <Link to="/ingredients/new" className="btn btn-primary">
            <Plus className="w-4 h-4 mr-1" />
            Create Ingredient
          </Link>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-base-200">
                  <tr>
                    <th className="text-base-content font-semibold">Name</th>
                    <th className="text-base-content font-semibold">Type</th>
                    <th className="text-base-content font-semibold">Description</th>
                    <th className="text-base-content font-semibold">Used In</th>
                    <th className="text-base-content font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200">
                  {ingredients.map((ingredient) => (
                    <tr key={ingredient.id} className="hover">
                      <td>
                        <div className="font-medium text-base-content">{ingredient.name}</div>
                      </td>
                      <td>
                        {ingredient.type ? (
                          <span className="badge badge-outline text-secondary">
                            {ingredient.type.charAt(0).toUpperCase() +
                              ingredient.type.slice(1).toLowerCase()}
                          </span>
                        ) : (
                          <span className="text-base-content/40">—</span>
                        )}
                      </td>
                      <td className="text-sm text-base-content/70">
                        {ingredient.description
                          ? ingredient.description.length > 60
                            ? ingredient.description.slice(0, 60) + "..."
                            : ingredient.description
                          : "—"}
                      </td>
                      <td className="text-base-content">{ingredient._count.recipes}</td>
                      <td className="text-right">
                        <div className="flex gap-2 justify-end">
                          <a
                            href={`/ingredients/${ingredient.id}/edit`}
                            className="btn btn-sm btn-ghost text-base-content/70 hover:text-primary hover:bg-base-200"
                          >
                            <Pencil className="w-4 h-4" />
                          </a>
                          <DeleteButton onDelete={() => deleteMutation.mutate(ingredient.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DeleteButton({ onDelete }: { onDelete: () => void }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (confirm("Are you sure? This ingredient will be removed from all recipes.")) {
          onDelete();
        }
      }}
      className="inline"
    >
      <button type="submit" className="btn btn-sm btn-ghost text-error hover:bg-error/10">
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  );
}
