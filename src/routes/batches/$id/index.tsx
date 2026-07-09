import { BatchLabel } from "#/components/batch/BatchLabel";
import DownloadLabelButton from "#/components/batch/DownloadLabelButton.tsx";
import { BatchUpdateForm } from "@/components/batch-updates/BatchUpdateForm";
import { BatchUpdatesList, type BatchUpdate } from "@/components/batch-updates/BatchUpdatesList";
import { useBatchUpdates, useCreateBatchUpdate } from "@/lib/batch-updates/use-batch-updates";
import { BATCH_STATUSES } from "@/lib/batches/batch-validation";
import { useUpdateBatchStatus } from "@/lib/batches/use-batches";
import { prisma } from "@/lib/db";
import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Calendar, Pencil, ShoppingCart } from "lucide-react";

const getBatch = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return prisma.batch.findUnique({
      where: { id: data.id },
      include: {
        recipe: { select: { id: true, name: true, brewType: true } },
        ingredients: {
          include: {
            ingredient: { select: { name: true, defaultPrice: true } },
            recipeIngredient: { select: { amount: true, unit: true } },
          },
        },
      },
    });
  });

export const Route = createFileRoute("/batches/$id/")({
  component: BatchDetailPage,
  loader: async ({ params }) => {
    const batch = await getBatch({ data: { id: params.id } });
    if (!batch) {
      throw new Error("NOT_FOUND");
    }
    return { batch };
  },
});

function BatchDetailPage() {
  const loaderData = Route.useLoaderData();
  const batchId = loaderData.batch.id;
  const router = useRouter();
  const { data: updates } = useBatchUpdates(batchId);
  const mutation = useCreateBatchUpdate(batchId);
  const statusMutation = useUpdateBatchStatus(batchId);

  const handleAddUpdate = async (data: {
    batchId: string;
    timestamp?: Date;
    notes?: string;
    image?: string;
  }) => {
    await mutation.mutateAsync(data);
  };

  const batch = loaderData.batch;
  const batchUpdates = (updates as BatchUpdate[] | undefined) || [];

  const handleChangeStatus = async (status: string) => {
    await statusMutation.mutateAsync(status as (typeof BATCH_STATUSES)[number]);
    await router.invalidate();
  };

  const statusColors: Record<string, string> = {
    PLANNING: "badge-info",
    FERMENTING: "badge-warning",
    CONDITIONING: "badge-accent",
    BOTTLED: "badge-success",
    COMPLETE: "badge-primary",
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="mb-6">
        <div className="flex items-start sm:items-center justify-between gap-2 mb-1">
          <h1 className="text-xl sm:text-2xl font-bold text-base-content truncate">
            {batch.recipe.name}
          </h1>
          <span className="text-xs sm:text-sm text-base-content/50 uppercase whitespace-nowrap shrink-0">
            {batch.recipe.brewType}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
          <select
            className={`select select-sm flex-1 sm:flex-initial ${statusColors[batch.status] || "badge-ghost"} border-0`}
            value={batch.status}
            onChange={async (e) => {
              await handleChangeStatus(e.target.value);
            }}
          >
            {BATCH_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <span className="text-xs text-base-content/50">
            Created {new Date(batch.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {mutation.isError && (
        <div className="alert alert-error mb-4" role="alert">
          <span>{(mutation.error as Error).message}</span>
        </div>
      )}

      <div className="card bg-base-100 shadow-lg border border-base-300 mb-6">
        <div className="card-body">
          <h2 className="card-title">Batch Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div>
              <span className="text-xs text-base-content/50">Start Date</span>
              <p>{batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "—"}</p>
            </div>
            {batch.endDate && (
              <div>
                <span className="text-xs text-base-content/50">End Date</span>
                <p>{new Date(batch.endDate).toLocaleDateString()}</p>
              </div>
            )}
            {batch.batchSize && (
              <div>
                <span className="text-xs text-base-content/50">Batch Size</span>
                <p>{batch.batchSize} liters</p>
              </div>
            )}
            {batch.ogReading && (
              <>
                <div>
                  <span className="text-xs text-base-content/50">OG</span>
                  <p>{batch.ogReading}</p>
                </div>
                <div>
                  <span className="text-xs text-base-content/50">Est. ABV</span>
                  <p>{((batch.ogReading - 1.0) * 131.25).toFixed(1)}%</p>
                </div>
              </>
            )}
            {batch.fgReading && (
              <div>
                <span className="text-xs text-base-content/50">FG</span>
                <p>{batch.fgReading}</p>
              </div>
            )}
            {batch.currentGravity && (
              <div>
                <span className="text-xs text-base-content/50">Current Gravity</span>
                <p>{batch.currentGravity}</p>
              </div>
            )}
          </div>
          {batch.notes && (
            <div className="mt-4">
              <span className="text-xs text-base-content/50">Batch Notes</span>
              <p className="text-sm mt-1 whitespace-pre-wrap">{batch.notes}</p>
            </div>
          )}
          <div className="divider my-2" />
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              to="/batches/$id/edit"
              params={{ id: batch.id }}
              className="btn btn-primary flex-1 justify-center sm:justify-start"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit Batch
            </Link>
            <DownloadLabelButton batch={batch} />
          </div>

          <div className="flex justify-center mt-4 overflow-x-auto">
            <div className="bg-white rounded-lg shadow-lg p-2 shrink-0">
              <BatchLabel
                recipeName={batch.recipe.name}
                brewType={batch.recipe.brewType}
                startDate={batch.startDate}
                notes={batch.notes}
                batchId={batch.id}
              />
            </div>
          </div>
        </div>
      </div>

      {batch.ingredients && batch.ingredients.length > 0 && (
        <div className="card bg-base-100 shadow-lg border border-base-300 mb-6">
          <div className="card-body">
            <h2 className="card-title">
              <ShoppingCart className="w-5 h-5" />
              Ingredients & Cost
            </h2>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr className="border-base-300">
                    <th className="w-1/3">Ingredient</th>
                    <th className="w-24">Amount</th>
                    <th className="w-32">Unit Price (£)</th>
                    <th className="w-24 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {batch.ingredients.map((bi: (typeof batch.ingredients)[number]) => {
                    const unitPrice = bi.price ?? bi.ingredient.defaultPrice ?? 0;
                    const cost = unitPrice * bi.recipeIngredient.amount;
                    return (
                      <tr key={bi.id} className="border-base-200">
                        <td className="font-medium">{bi.ingredient.name}</td>
                        <td className="text-sm text-base-content/70">
                          {bi.recipeIngredient.amount} {bi.recipeIngredient.unit}
                        </td>
                        <td className="text-sm text-base-content/70">£{unitPrice.toFixed(2)}</td>
                        <td className="text-right font-mono text-sm">£{cost.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-primary font-bold border-t-2">
                    <td colSpan={3} className="text-right pr-4">
                      Total Ingredient Cost:
                    </td>
                    <td className="text-lg">
                      £
                      {batch.ingredients
                        .reduce((sum, bi) => {
                          const unitPrice = bi.price ?? bi.ingredient.defaultPrice ?? 0;
                          return sum + unitPrice * bi.recipeIngredient.amount;
                        }, 0)
                        .toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="card bg-base-100 shadow-lg border border-base-300 print:hidden">
        <div className="card-body">
          <h2 className="card-title mb-4">
            Updates
            <span className="badge badge-ghost badge-sm">{batchUpdates.length}</span>
          </h2>

          <BatchUpdateForm batchId={batchId} onSubmit={handleAddUpdate} />

          <div className="divider my-6">
            <div className="flex items-center gap-2 text-base-content/50">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">History</span>
            </div>
          </div>

          {mutation.isPending ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-md" />
            </div>
          ) : (
            <BatchUpdatesList updates={batchUpdates} />
          )}
        </div>
      </div>
    </div>
  );
}
