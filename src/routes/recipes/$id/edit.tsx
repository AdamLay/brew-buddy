import { useUpdateRecipe } from "#/lib/recipes/use-recipes";
import { RecipeForm } from "@/components/recipe/RecipeForm";
import { prisma } from "@/lib/db";
import { createFileRoute } from "@tanstack/react-router";
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
  const mutation = useUpdateRecipe(loaderData.recipe.id, () => {
    window.scrollTo(0, 0);
  });

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-base-content mb-6">Edit Recipe</h1>
      {mutation.isSuccess && (
        <div className="alert alert-success mb-6" role="alert">
          <span>Recipe updated successfully!</span>
        </div>
      )}
      {mutation.isError && (
        <div className="alert alert-error mb-6" role="alert">
          <span>{(mutation.error as Error).message}</span>
        </div>
      )}
      <div className="card bg-base-100 shadow-lg border border-base-300">
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
