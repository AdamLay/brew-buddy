import { useBatches, useDeleteBatch } from "@/lib/batches/use-batches";
import { batchKeys as bk } from "@/lib/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ListShell } from "@/components/ui/ListShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { useViewMode } from "@/components/ui/use-view-toggle";
import { BatchTable, BatchCards } from "@/components/batch/BatchTable";

export const Route = createFileRoute("/batches/")({
  component: BatchesPage,
});

function BatchesPage() {
  const { data: batches, isLoading } = useBatches();
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteBatch(() => {
    queryClient.invalidateQueries({ queryKey: bk.lists() });
  });

  const [viewMode, toggleView] = useViewMode("batches");

  const emptyContent = (
    <EmptyState
      message="No batches yet. Create your first batch!"
      buttonText="Create Batch"
      buttonHref="/batches/new"
    />
  );

  if (!batches || batches.length === 0) {
    return (
      <ListShell
        title="Batches"
        addButtonText="New Batch"
        addHref="/batches/new"
        isLoading={isLoading}
      >
        {emptyContent}
      </ListShell>
    );
  }

  return (
    <>
      <ListShell
        title="Batches"
        addButtonText="New Batch"
        addHref="/batches/new"
        isLoading={isLoading}
        actions={<ViewToggle mode={viewMode} onToggle={toggleView} />}
      >
        {viewMode === "table" ? (
          <BatchTable
            batches={batches}
            onEdit={(id) => `/batches/${id}/edit`}
            onDelete={(id) => () => deleteMutation.mutate(id)}
          />
        ) : (
          <BatchCards
            batches={batches}
            onEdit={(id) => `/batches/${id}/edit`}
            onDelete={(id) => () => deleteMutation.mutate(id)}
          />
        )}
      </ListShell>
    </>
  );
}
