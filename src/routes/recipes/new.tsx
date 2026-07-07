import { createFileRoute } from "@tanstack/react-router";
import { RecipeForm } from "@/components/recipe/RecipeForm";
import { z } from "zod";

const errorSchema = z.object({
  error: z.string().optional(),
});

export const Route = createFileRoute("/recipes/new")({
  component: NewRecipePage,
  validateSearch: errorSchema,
});

function NewRecipePage() {
  const { error } = Route.useSearch();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <a href="/recipes" className="btn btn-ghost btn-sm mb-4">
        &larr; Back to Recipes
      </a>
      <h1 className="text-3xl font-bold mb-6">New Recipe</h1>
      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <form action="/api/recipes" method="post">
            <input type="hidden" name="_method" value="create" />
            <RecipeForm action="" />
          </form>
        </div>
      </div>
    </div>
  );
}
