import { useCreateBatch } from "@/lib/batches/use-batches";
import { prisma } from "@/lib/db";
import { BatchForm } from "@/components/batch/BatchForm";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ArrowLeft } from "lucide-react";

const getRecipes = createServerFn({ method: "GET" }).handler(async () => {
  return prisma.recipe.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
});

export const Route = createFileRoute("/batches/new")({
  component: NewBatchPage,
  loader: async () => {
    const recipes = await getRecipes();
    return { recipes };
  },
});

function NewBatchPage() {
  const navigate = useNavigate();
  const loaderData = Route.useLoaderData();
  const mutation = useCreateBatch(() => {
    void navigate({ to: "/batches" });
  });

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/batches" className="btn btn-ghost btn-sm mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Batches
      </Link>
      <h1 className="text-3xl font-bold mb-6">New Batch</h1>
      {mutation.isError && (
        <div className="alert alert-error mb-6">
          <span>{(mutation.error as Error).message}</span>
        </div>
      )}
      {mutation.isSuccess && (
        <div className="alert alert-success mb-6">
          <span>Batch created successfully!</span>
        </div>
      )}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <BatchForm
            recipes={loaderData.recipes}
            onSubmit={async (data) => {
              await mutation.mutateAsync(data);
            }}
          />
        </div>
      </div>
    </div>
  );
}
