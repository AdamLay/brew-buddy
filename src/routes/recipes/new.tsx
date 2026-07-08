import { useCreateRecipe } from "#/lib/recipes/use-recipes";
import { RecipeForm } from "@/components/recipe/RecipeForm";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/recipes/new")({
  component: NewRecipePage,
});

function NewRecipePage() {
  const mutation = useCreateRecipe();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link to="/recipes" className="btn btn-ghost btn-sm mb-4">
        &larr; Back to Recipes
      </Link>
      <h1 className="text-3xl font-bold mb-6">New Recipe</h1>
      {mutation.isError && (
        <div className="alert alert-error mb-6">
          <span>{(mutation.error as Error).message}</span>
        </div>
      )}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <RecipeForm
            onSubmit={async (data) => {
              await mutation.mutateAsync(data);
            }}
          />
        </div>
      </div>
    </div>
  );
}
