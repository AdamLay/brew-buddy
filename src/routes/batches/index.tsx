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
    PLANNING: "badge-outline",
    FERMENTING: "badge-info",
    CONDITIONING: "badge-warning",
    BOTTLED: "badge-success",
    COMPLETE: "badge-primary",
  };
  return (
    <span className={`badge ${colors[status] || "badge-ghost"}`}>
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
        <h1 className="text-3xl font-bold">Batches</h1>
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
        <div className="text-center py-16 bg-base-100 rounded-xl">
          <p className="text-gray-500 text-lg mb-4">No batches yet. Create your first batch!</p>
          <Link to="/batches/new" className="btn btn-primary">
            <Plus className="w-4 h-4 mr-1" />
            Create Batch
          </Link>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-base-200">
                    <th>Recipe</th>
                    <th>Status</th>
                    <th>Size (L)</th>
                    <th>Start</th>
                    <th>OG</th>
                    <th>FG</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((batch) => (
                    <tr key={batch.id} className="hover">
                      <td>
                        <div className="font-medium">{batch.recipe.name}</div>
                        {batch.recipe.brewType && (
                          <div className="text-xs text-base-content/60">
                            {batch.recipe.brewType.toLowerCase()}
                          </div>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={batch.status} />
                      </td>
                      <td>{batch.batchSize ?? "—"}</td>
                      <td>
                        {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "—"}
                      </td>
                      <td>{batch.ogReading ?? "—"}</td>
                      <td>{batch.fgReading ?? "—"}</td>
                      <td className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Link
                            to="/batches/$id/edit"
                            params={{ id: batch.id }}
                            className="btn btn-sm btn-ghost"
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
      <button type="submit" className="btn btn-sm btn-ghost text-error">
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  );
}
