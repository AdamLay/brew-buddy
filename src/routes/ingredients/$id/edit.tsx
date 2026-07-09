import { useUpdateIngredient } from "#/lib/ingredients/use-ingredients";
import { IngredientForm } from "@/components/ingredient/IngredientForm";
import { prisma } from "@/lib/db";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

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
    <div className="max-w-3xl mx-auto w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-4 sm:mb-6">
        Edit Ingredient
      </h1>
      {mutation.isSuccess && (
        <div className="alert alert-success mb-6" role="alert">
          <span>Ingredient updated successfully!</span>
        </div>
      )}
      {mutation.isError && (
        <div className="alert alert-error mb-6" role="alert">
          <span>{(mutation.error as Error).message}</span>
        </div>
      )}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        <div className="card-body p-4 sm:p-6">
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
