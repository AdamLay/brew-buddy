import { prisma } from "@/lib/db";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { IngredientForm } from "@/components/ingredient/IngredientForm";

const errorSchema = z.object({
  error: z.string().optional(),
});

export const Route = createFileRoute("/ingredients/$id/edit")({
  component: EditIngredientPage,
  validateSearch: errorSchema,
  loader: async ({ params }: { params: { id: string } }) => {
    const ingredient = await prisma.ingredient.findUnique({
      where: { id: params.id },
    });
    if (!ingredient) {
      throw redirect({ to: "/ingredients" });
    }
    return { ingredient };
  },
});

function EditIngredientPage() {
  const { ingredient } = Route.useLoaderData();
  const { error } = Route.useSearch();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <a href="/ingredients" className="btn btn-ghost btn-sm mb-4">
        &larr; Back to Ingredients
      </a>
      <h1 className="text-3xl font-bold mb-6">Edit Ingredient</h1>
      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <form action={`/api/ingredients/${ingredient.id}`} method="post">
            <input type="hidden" name="_method" value="update" />
            <IngredientForm ingredient={ingredient} submitLabel="Update Ingredient" />
          </form>
        </div>
      </div>
    </div>
  );
}
