import { prisma } from "@/lib/db";
import { createFileRoute } from "@tanstack/react-router";
import type { Ingredient as IngredientType } from "@/generated/prisma/client";

const DESCRIPTION_TRUNCATE = 60;

type IngredientWithCount = IngredientType & { _count: { recipes: number } };

export const Route = createFileRoute("/ingredients/")({
  component: IngredientsPage,
  loader: async () => {
    const ingredients = await prisma.ingredient.findMany({
      include: { _count: { select: { recipes: true } } },
    });
    return { ingredients };
  },
});

function IngredientsPage() {
  const { ingredients } = Route.useLoaderData();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ingredients</h1>
        <a href="/ingredients/new" className="btn btn-primary">
          New Ingredient
        </a>
      </div>

      {ingredients.length === 0 ? (
        <div className="text-center py-16 bg-base-100 rounded-xl">
          <p className="text-gray-500 text-lg mb-4">
            No ingredients yet. Create your first ingredient!
          </p>
          <a href="/ingredients/new" className="btn btn-primary">
            Create Ingredient
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
                    <th>Description</th>
                    <th>Used In</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ingredient: IngredientWithCount) => (
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
                          ? ingredient.description.length > DESCRIPTION_TRUNCATE
                            ? ingredient.description.slice(0, DESCRIPTION_TRUNCATE) + "..."
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
                          <DeleteButton id={ingredient.id} />
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

function DeleteButton({ id }: { id: string }) {
  return (
    <form action={`/ingredients/${id}/delete`} method="post" className="inline">
      <button
        type="submit"
        className="btn btn-sm btn-ghost text-error"
        onClick={(e) => {
          if (!confirm("Are you sure? This ingredient will be removed from all recipes.")) {
            e.preventDefault();
          }
        }}
      >
        Delete
      </button>
    </form>
  );
}
