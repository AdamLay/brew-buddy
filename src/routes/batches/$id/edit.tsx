import { BatchForm } from "@/components/batch/BatchForm";
import { useUpdateBatch } from "@/lib/batches/use-batches";
import { prisma } from "@/lib/db";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getBatch = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return prisma.batch.findUnique({
      where: { id: data.id },
      include: {
        recipe: { select: { id: true, name: true } },
        ingredients: {
          include: {
            ingredient: { select: { id: true, name: true, defaultPrice: true } },
            recipeIngredient: { select: { amount: true, unit: true } },
          },
        },
      },
    });
  });

const getRecipes = createServerFn({ method: "GET" }).handler(async () => {
  return prisma.recipe.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
});

export const Route = createFileRoute("/batches/$id/edit")({
  component: EditBatchPage,
  loader: async ({ params }) => {
    const [batch, recipes] = await Promise.all([
      getBatch({ data: { id: params.id } }),
      getRecipes(),
    ]);
    if (!batch) {
      throw new Error("NOT_FOUND");
    }
    return { batch, recipes };
  },
});

function EditBatchPage() {
  const loaderData = Route.useLoaderData();
  const navigate = useNavigate();
  const mutation = useUpdateBatch(loaderData.batch.id, () => {
    navigate({ to: "/batches/$id", params: { id: loaderData.batch.id } });
  });

  return (
    <div className="max-w-3xl mx-auto w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-4 sm:mb-6">Edit Batch</h1>
      {mutation.isSuccess && (
        <div className="alert alert-success mb-6" role="alert">
          <span>Batch updated successfully!</span>
        </div>
      )}
      {mutation.isError && (
        <div className="alert alert-error mb-6" role="alert">
          <span>{(mutation.error as Error).message}</span>
        </div>
      )}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        <div className="card-body p-4 sm:p-6">
          <BatchForm
            batch={loaderData.batch}
            recipes={loaderData.recipes}
            submitLabel="Update Batch"
            onSubmit={async (data) => {
              console.log("Submitting data:", data);
              await mutation.mutateAsync(data);
            }}
          />
        </div>
      </div>
    </div>
  );
}
