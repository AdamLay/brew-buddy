import { BatchForm } from "@/components/batch/BatchForm";
import { useCreateBatch } from "@/lib/batches/use-batches";
import { prisma } from "@/lib/db";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const getRecipes = createServerFn({ method: "GET" }).handler(async () => {
  return prisma.recipe.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
});

const searchSchema = z.object({
  recipeId: z.string().optional(),
});

export const Route = createFileRoute("/batches/new")({
  component: NewBatchPage,
  validateSearch: searchSchema,
  loader: async () => {
    const recipes = await getRecipes();
    return { recipes };
  },
});

function NewBatchPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: Route.fullPath });
  const loaderData = Route.useLoaderData();
  const mutation = useCreateBatch(() => {
    void navigate({ to: "/batches" });
  });

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-base-content mb-6">New Batch</h1>
      {mutation.isError && (
        <div className="alert alert-error mb-6" role="alert">
          <span>{(mutation.error as Error).message}</span>
        </div>
      )}
      {mutation.isSuccess && (
        <div className="alert alert-success mb-6" role="alert">
          <span>Batch created successfully!</span>
        </div>
      )}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        <div className="card-body">
          <BatchForm
            recipes={loaderData.recipes}
            preselectedRecipeId={search.recipeId}
            onSubmit={async (data) => {
              await mutation.mutateAsync(data);
            }}
          />
        </div>
      </div>
    </div>
  );
}
