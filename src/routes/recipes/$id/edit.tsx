import { useUpdateRecipe } from "#/lib/recipes/use-recipes";
import { RecipeForm } from "@/components/recipe/RecipeForm";
import { prisma } from "@/lib/db";
import { Link, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getRecipe = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return prisma.recipe.findUnique({
      where: { id: data.id },
      include: { ingredients: { include: { ingredient: true } } },
    });
  });

export const Route = createFileRoute("/recipes/$id/edit")({
  component: EditRecipePage,
  loader: async ({ params }) => {
    const recipe = await getRecipe({ data: { id: params.id } });
    if (!recipe) {
      throw new Error("NOT_FOUND");
    }
    return { recipe };
  },
});

function EditRecipePage() {
  const loaderData = Route.useLoaderData();
  const mutation = useUpdateRecipe(loaderData.recipe.id);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link to="/recipes" className="btn btn-ghost btn-sm mb-4">
        &larr; Back to Recipes
      </Link>
      <h1 className="text-3xl font-bold mb-6">Edit Recipe</h1>
      {mutation.isError && (
        <div className="alert alert-error mb-6">
          <span>{(mutation.error as Error).message}</span>
        </div>
      )}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <RecipeForm
            recipe={loaderData.recipe}
            onSubmit={async (data) => {
              await mutation.mutateAsync(data);
            }}
          />
        </div>
      </div>
    </div>
  );
}
