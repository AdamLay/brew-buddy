import { prisma } from "@/lib/db";
import { createFileRoute } from "@tanstack/react-router";
import type { Recipe as RecipeType } from "@/generated/prisma/client";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => {
    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { batches: true } } },
    });
    return { recipes };
  },
});

function Home() {
  const { recipes } = Route.useLoaderData();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <a href="/recipes/new" className="btn btn-primary">
          New Recipe
        </a>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-16 bg-base-100 rounded-xl">
          <p className="text-gray-500 text-lg mb-4">No recipes yet. Create your first recipe!</p>
          <a href="/recipes/new" className="btn btn-primary">
            Create Recipe
          </a>
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
                  {recipes.map((recipe: RecipeType & { _count: { batches: number } }) => (
                    <tr key={recipe.id} className="hover">
                      <td>
                        <div>
                          <div className="font-medium">{recipe.name}</div>
                          {recipe.description && (
                            <div className={`text-sm ${recipe.description.length > 80 ? 'truncate max-w-xs' : ''}`}>
                              {recipe.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-outline">
                          {recipe.brewType.charAt(0).toUpperCase() + recipe.brewType.slice(1).toLowerCase()}
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
                          <a href={`/recipes/${recipe.id}/edit`} className="btn btn-sm btn-ghost">
                            Edit
                          </a>
                          <DeleteButton id={recipe.id} />
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

// ponytail: inline delete with POST instead of GET to prevent CSRF; confirm dialog replaced with inline toggle
function DeleteButton({ id }: { id: string }) {
  return (
    <form action={`/recipes/${id}/delete`} method="post" className="inline">
      <button
        type="submit"
        className="btn btn-sm btn-ghost text-error"
        onClick={(e) => {
          if (!confirm("Are you sure? All associated batches and ingredients will also be deleted.")) {
            e.preventDefault();
          }
        }}
      >
        Delete
      </button>
    </form>
  );
}
