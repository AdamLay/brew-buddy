import { useCreateIngredient } from "#/lib/ingredients/use-ingredients";
import { IngredientForm } from "@/components/ingredient/IngredientForm";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/ingredients/new")({
  component: NewIngredientPage,
});

function NewIngredientPage() {
  const navigate = useNavigate();
  const mutation = useCreateIngredient(() => {
    navigate({ to: "/ingredients" });
  });

  return (
    <div className="max-w-3xl mx-auto w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-4 sm:mb-6">
        New Ingredient
      </h1>
      {mutation.isError && (
        <div className="alert alert-error mb-6" role="alert">
          <span>{(mutation.error as Error).message}</span>
        </div>
      )}
      {mutation.isSuccess && (
        <div className="alert alert-success mb-6" role="alert">
          <span>Ingredient created successfully!</span>
        </div>
      )}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        <div className="card-body p-4 sm:p-6">
          <IngredientForm
            onSubmit={async (data) => {
              console.log("Submitting ingredient:", data);
              await mutation.mutateAsync(data);
            }}
          />
        </div>
      </div>
    </div>
  );
}
