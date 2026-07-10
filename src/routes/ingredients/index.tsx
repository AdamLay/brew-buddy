import { useDeleteIngredient, useIngredients } from "#/lib/ingredients/use-ingredients";
import { IngredientCards, IngredientTable } from "@/components/ingredient/IngredientTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListShell } from "@/components/ui/ListShell";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { useViewMode } from "@/components/ui/use-view-toggle";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ingredients/")({
  component: IngredientsPage,
});

function IngredientsPage() {
  const { data: ingredients, isLoading } = useIngredients();
  const deleteMutation = useDeleteIngredient();

  const [viewMode, toggleView] = useViewMode("ingredients");

  const emptyContent = (
    <EmptyState
      message="No ingredients yet. Create your first ingredient!"
      buttonText="Create Ingredient"
      buttonHref="/ingredients/new"
    />
  );

  if (!ingredients || ingredients.length === 0) {
    return (
      <ListShell
        title="Ingredients"
        addButtonText="New Ingredient"
        addHref="/ingredients/new"
        isLoading={isLoading}
      >
        {emptyContent}
      </ListShell>
    );
  }

  return (
    <>
      <ListShell
        title="Ingredients"
        addButtonText="New Ingredient"
        addHref="/ingredients/new"
        isLoading={isLoading}
        actions={<ViewToggle mode={viewMode} onToggle={toggleView} />}
      >
        {viewMode === "table" ? (
          <IngredientTable
            ingredients={ingredients}
            onEdit={(id) => `/ingredients/${id}/edit`}
            onDelete={(id) => () => deleteMutation.mutate(id)}
          />
        ) : (
          <IngredientCards
            ingredients={ingredients}
            onEdit={(id) => `/ingredients/${id}/edit`}
            onDelete={(id) => () => deleteMutation.mutate(id)}
          />
        )}
      </ListShell>
    </>
  );
}
