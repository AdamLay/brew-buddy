import { IngredientForm } from "@/components/ingredient/IngredientForm";
import { useCreateIngredient } from "@/lib/use-ingredient-mutations";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/ingredients/new")({
  component: NewIngredientPage,
});

function NewIngredientPage() {
  const navigate = useNavigate();
  const mutation = useCreateIngredient(() => {
    navigate({ to: "/ingredients" });
  });

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link to="/ingredients" className="btn btn-ghost btn-sm mb-4">
        &larr; Back to Ingredients
      </Link>
      <h1 className="text-3xl font-bold mb-6">New Ingredient</h1>
      {mutation.isError && (
        <div className="alert alert-error mb-6">
          <span>{(mutation.error as Error).message}</span>
        </div>
      )}
      {mutation.isSuccess && (
        <div className="alert alert-success mb-6">
          <span>Ingredient created successfully!</span>
        </div>
      )}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <IngredientForm
            onSubmit={async (data) => {
              await mutation.mutateAsync(data);
            }}
          />
        </div>
      </div>
    </div>
  );
}
