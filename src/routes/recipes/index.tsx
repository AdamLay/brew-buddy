import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecipes } from "@/lib/use-recipes";
import { deleteRecipe as deleteRecipeFn } from "@/lib/recipe-mutations";
import { recipeKeys } from "@/lib/query-keys";

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
        <h1 className="text-3xl font-bold">Recipes</h1>
        <Link to="/recipes/new" className="btn btn-primary">
          New Recipe
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : !recipes || recipes.length === 0 ? (
        <div className="text-center py-16 bg-base-100 rounded-xl">
          <p className="text-gray-500 text-lg mb-4">No recipes yet. Create your first recipe!</p>
          <Link to="/recipes/new" className="btn btn-primary">
            Create Recipe
          </Link>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-base-200">
                    <th>Name</th>
                    <th>Type</th>
                    <th>Batch Size</th>
                    <th>OG / FG</th>
                    <th>Batches</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recipes.map((recipe) => (
                    <tr key={recipe.id} className="hover">
                      <td>
                        <div>
                          <div className="font-medium">{recipe.name}</div>
                          {recipe.description && (
                            <div
                              className={`text-sm ${recipe.description.length > 80 ? "truncate max-w-xs" : ""}`}
                            >
                              {recipe.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-outline">
                          {recipe.brewType.charAt(0).toUpperCase() +
                            recipe.brewType.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td>{recipe.batchSize ? `${recipe.batchSize}L` : "—"}</td>
                      <td className="text-sm">
                        {recipe.originalGravity ? ` ${recipe.originalGravity}` : "—"}
                        {recipe.finalGravity && (
                          <>
                            {" → "}
                            {recipe.finalGravity}
                          </>
                        )}
                      </td>
                      <td>{recipe._count.batches}</td>
                      <td className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Link
                            to={`/recipes/${recipe.id}/edit` as any}
                            className="btn btn-sm btn-ghost"
                          >
                            Edit
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
      <button
        type="submit"
        className="btn btn-sm btn-ghost text-error"
      >
        Delete
      </button>
    </form>
  );
}
