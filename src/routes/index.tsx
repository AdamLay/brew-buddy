import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Brew Buddy</h1>
      <p className="text-gray-500">Plan recipes. Track batches. Perfect your brew.</p>
    </div>
  );
}
