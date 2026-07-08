import { useUpdateIngredient } from "#/lib/ingredients/use-ingredients";
import { IngredientForm } from "@/components/ingredient/IngredientForm";
import { prisma } from "@/lib/db";
import { Link, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ArrowLeft } from "lucide-react";

const getIngredient = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return prisma.ingredient.findUnique({
      where: { id: data.id },
    });
  });

export const Route = createFileRoute("/ingredients/$id/edit")({
  component: EditIngredientPage,
  loader: async ({ params }) => {
    const ingredient = await getIngredient({ data: { id: params.id } });
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
  const mutation = useUpdateIngredient(loaderData.ingredient.id, () => {
    window.scrollTo(0, 0);
  });

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/ingredients" className="btn btn-ghost btn-sm mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Ingredients
      </Link>
      <h1 className="text-3xl font-bold mb-6">Edit Ingredient</h1>
      {mutation.isSuccess && (
        <div className="alert alert-success mb-6">
          <span>Ingredient updated successfully!</span>
        </div>
      )}
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
