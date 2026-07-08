import { useDeleteBatch, useBatches } from "@/lib/batches/use-batches";
import { batchKeys as bk } from "@/lib/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/batches/")({
  component: BatchesPage,
});

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PLANNING: "badge-ghost text-base-content/60 border-base-content/20",
    FERMENTING: "badge-warning text-warning border-warning",
    CONDITIONING: "badge-warning text-warning border-warning",
    BOTTLED: "badge-success text-success border-success",
    COMPLETE: "badge-secondary text-secondary-content border-secondary",
  };
  return (
    <span className={`badge ${colors[status] || "badge-ghost text-base-content/60"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function BatchesPage() {
  const queryClient = useQueryClient();
  const { data: batches, isLoading } = useBatches();
  const deleteMutation = useDeleteBatch(() => {
    queryClient.invalidateQueries({ queryKey: bk.lists() });
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-base-content">Batches</h1>
        <Link to="/batches/new" className="btn btn-primary">
          <Plus className="w-4 h-4 mr-1" />
          New Batch
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : !batches || batches.length === 0 ? (
        <div className="text-center py-16 bg-base-100 rounded-xl border border-base-300">
          <p className="text-base-content/60 text-lg mb-4">No batches yet. Create your first batch!</p>
          <Link to="/batches/new" className="btn btn-primary">
            <Plus className="w-4 h-4 mr-1" />
            Create Batch
          </Link>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-base-200">
                  <tr>
                    <th className="text-base-content font-semibold">Recipe</th>
                    <th className="text-base-content font-semibold">Status</th>
                    <th className="text-base-content font-semibold">Size (L)</th>
                    <th className="text-base-content font-semibold">Start</th>
                    <th className="text-base-content font-semibold">OG</th>
                    <th className="text-base-content font-semibold">FG</th>
                    <th className="text-base-content font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200">
                  {batches.map((batch) => (
                    <tr key={batch.id} className="hover">
                      <td>
                        <div className="font-medium text-base-content">{batch.recipe.name}</div>
                        {batch.recipe.brewType && (
                          <div className="text-xs text-base-content/50">
                            {batch.recipe.brewType.toLowerCase()}
                          </div>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={batch.status} />
                      </td>
                      <td className="text-base-content">{batch.batchSize ?? "—"}</td>
                      <td className="text-base-content">
                        {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="text-base-content">{batch.ogReading ?? "—"}</td>
                      <td className="text-base-content">{batch.fgReading ?? "—"}</td>
                      <td className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Link
                            to="/batches/$id/edit"
                            params={{ id: batch.id }}
                            className="btn btn-sm btn-ghost text-base-content/70 hover:text-primary hover:bg-base-200"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <DeleteButton onDelete={() => deleteMutation.mutate(batch.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DeleteButton({ onDelete }: { onDelete: () => void }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (confirm("Are you sure? This batch will be permanently deleted.")) {
          onDelete();
        }
      }}
      className="inline"
    >
      <button type="submit" className="btn btn-sm btn-ghost text-error hover:bg-error/10">
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  );
}
