import { prisma } from "@/lib/db";
import { createFileRoute } from "@tanstack/react-router";
import { RecipeForm } from "@/components/recipe/RecipeForm";
import { z } from "zod";

const errorSchema = z.object({
  error: z.string().optional(),
});

export const Route = createFileRoute("/recipes/$id/edit")({
  component: EditRecipePage,
  validateSearch: errorSchema,
  loader: async ({ params }: { params: { id: string } }) => {
    const recipe = await prisma.recipe.findUnique({
      where: { id: params.id },
    });
    if (!recipe) {
      throw new Error("Recipe not found");
    }
    return { recipe };
  },
});

function EditRecipePage() {
  const { recipe } = Route.useLoaderData();
  const { error } = Route.useSearch();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <a href="/recipes" className="btn btn-ghost btn-sm mb-4">
        &larr; Back to Recipes
      </a>
      <h1 className="text-3xl font-bold mb-6">Edit Recipe</h1>
      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <form action={`/api/recipes/${recipe.id}`} method="post">
            <input type="hidden" name="_method" value="update" />
            <RecipeForm recipe={recipe} />
          </form>
        </div>
      </div>
    </div>
  );
}
