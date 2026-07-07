import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/recipes")({
  component: RecipesPage,
});

function RecipesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Recipes</h1>
      <p className="text-gray-500">Coming soon — browse and manage your brewing recipes.</p>
    </div>
  );
}
