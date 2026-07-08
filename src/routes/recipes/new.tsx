import { useCreateRecipe } from "#/lib/recipes/use-recipes";
import { RecipeForm } from "@/components/recipe/RecipeForm";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/recipes/new")({
  component: NewRecipePage,
});

function NewRecipePage() {
  const navigate = useNavigate();
  const mutation = useCreateRecipe(() => {
    void navigate({ to: "/recipes" });
  });

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/recipes" className="btn btn-ghost btn-sm mb-4 text-base-content/70 hover:text-primary">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Recipes
      </Link>
      <h1 className="text-3xl font-bold text-base-content mb-6">New Recipe</h1>
      {mutation.isError && (
        <div className="alert alert-error mb-6" role="alert">
          <span>{(mutation.error as Error).message}</span>
        </div>
      )}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        <div className="card-body">
          <RecipeForm
            onSubmit={async (data) => {
              console.log("Submitting recipe:", data);
              await mutation.mutateAsync(data);
            }}
          />
        </div>
      </div>
    </div>
  );
}
