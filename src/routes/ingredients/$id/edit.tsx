import { Link, createFileRoute } from "@tanstack/react-router";
import { prisma } from "@/lib/db";
import { useUpdateIngredient } from "@/lib/use-ingredient-mutations";
import { IngredientForm } from "@/components/ingredient/IngredientForm";

export const Route = createFileRoute("/ingredients/$id/edit")({
  component: EditIngredientPage,
  loader: async ({ params }) => {
    const ingredient = await prisma.ingredient.findUnique({
      where: { id: params.id },
    });
    if (!ingredient) {
      throw new Error("NOT_FOUND");
    }
    return { ingredient };
  },
});

function EditIngredientPage() {
  // ponytail: loader data accessed via Route.useLoaderData for SSR; 
  // in a full Query migration, this would use useQuery instead
  const loaderData = Route.useLoaderData();
  const mutation = useUpdateIngredient(loaderData.ingredient.id);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link to="/ingredients" className="btn btn-ghost btn-sm mb-4">
        &larr; Back to Ingredients
      </Link>
      <h1 className="text-3xl font-bold mb-6">Edit Ingredient</h1>
      {mutation.isError && (
        <div className="alert alert-error mb-6">
          <span>{(mutation.error as Error).message}</span>
        </div>
      )}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <IngredientForm
            ingredient={loaderData.ingredient}
            submitLabel="Update Ingredient"
            onSubmit={async (data) => {
              await mutation.mutateAsync(data);
            }}
          />
        </div>
      </div>
    </div>
  );
}
