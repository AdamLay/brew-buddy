import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/batches")({
  component: BatchesPage,
});

function BatchesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Batches</h1>
      <p className="text-gray-500">Coming soon — track your active and completed brew batches.</p>
    </div>
  );
}
