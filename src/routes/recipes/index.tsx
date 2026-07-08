import { deleteRecipeFn, useRecipes } from "#/lib/recipes/use-recipes";
import { recipeKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/recipes/")({
  component: RecipesPage,
});

function RecipesPage() {
  const queryClient = useQueryClient();
  const { data: recipes, isLoading } = useRecipes();
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRecipeFn(id as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-base-content">Recipes</h1>
        <Link to="/recipes/new" className="btn btn-primary">
          <Plus className="w-4 h-4 mr-1" />
          New Recipe
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : !recipes || recipes.length === 0 ? (
        <div className="text-center py-16 bg-base-100 rounded-xl border border-base-300">
          <p className="text-base-content/60 text-lg mb-4">
            No recipes yet. Create your first recipe!
          </p>
          <Link to="/recipes/new" className="btn btn-primary">
            <Plus className="w-4 h-4 mr-1" />
            Create Recipe
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
                    <th className="text-base-content font-semibold">Batches</th>
                    <th className="text-base-content font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200">
                  {recipes.map((recipe) => (
                    <tr key={recipe.id} className="hover">
                      <td>
                        <div>
                          <div className="font-medium text-base-content">{recipe.name}</div>
                          {recipe.description && (
                            <div
                              className={`text-sm text-base-content/60 ${recipe.description.length > 80 ? "truncate max-w-xs" : ""}`}
                            >
                              {recipe.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-accent">
                          {recipe.brewType.charAt(0).toUpperCase() +
                            recipe.brewType.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="text-base-content">{recipe._count.batches}</td>
                      <td className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Link
                            to={`/recipes/${recipe.id}/edit` as any}
                            className="btn btn-sm btn-ghost text-base-content/70 hover:text-primary hover:bg-base-200"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <DeleteButton onDelete={() => deleteMutation.mutate(recipe.id)} />
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
        if (confirm("Are you sure? All associated batches and ingredients will also be deleted.")) {
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
