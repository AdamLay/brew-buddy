import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { IngredientForm } from "@/components/ingredient/IngredientForm";

const errorSchema = z.object({
  error: z.string().optional(),
});

export const Route = createFileRoute("/ingredients/new")({
  component: NewIngredientPage,
  validateSearch: errorSchema,
});

function NewIngredientPage() {
  const { error } = Route.useSearch();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <a href="/ingredients" className="btn btn-ghost btn-sm mb-4">
        &larr; Back to Ingredients
      </a>
      <h1 className="text-3xl font-bold mb-6">New Ingredient</h1>
      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <form action="/api/ingredients" method="post">
            <input type="hidden" name="_method" value="create" />
            <IngredientForm />
          </form>
        </div>
      </div>
    </div>
  );
}
