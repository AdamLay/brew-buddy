import { useDeleteIngredient, useIngredients } from "#/lib/ingredients/use-ingredients";
import { ingredientKeys as ik } from "@/lib/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

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
        <h1 className="text-3xl font-bold">Ingredients</h1>
        <Link to="/ingredients/new" className="btn btn-primary">
          New Ingredient
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : !ingredients || ingredients.length === 0 ? (
        <div className="text-center py-16 bg-base-100 rounded-xl">
          <p className="text-gray-500 text-lg mb-4">
            No ingredients yet. Create your first ingredient!
          </p>
          <Link to="/ingredients/new" className="btn btn-primary">
            Create Ingredient
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
                    <th>Description</th>
                    <th>Used In</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ingredient) => (
                    <tr key={ingredient.id} className="hover">
                      <td>
                        <div className="font-medium">{ingredient.name}</div>
                      </td>
                      <td>
                        {ingredient.type ? (
                          <span className="badge badge-outline">
                            {ingredient.type.charAt(0).toUpperCase() +
                              ingredient.type.slice(1).toLowerCase()}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="text-sm">
                        {ingredient.description
                          ? ingredient.description.length > 60
                            ? ingredient.description.slice(0, 60) + "..."
                            : ingredient.description
                          : "—"}
                      </td>
                      <td>{ingredient._count.recipes}</td>
                      <td className="text-right">
                        <div className="flex gap-2 justify-end">
                          <a
                            href={`/ingredients/${ingredient.id}/edit`}
                            className="btn btn-sm btn-ghost"
                          >
                            Edit
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
      <button type="submit" className="btn btn-sm btn-ghost text-error">
        Delete
      </button>
    </form>
  );
}
