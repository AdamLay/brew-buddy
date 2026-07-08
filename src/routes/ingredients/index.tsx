import { useDeleteIngredient, useIngredients } from "#/lib/ingredients/use-ingredients";
import { ingredientKeys as ik } from "@/lib/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ListShell } from "@/components/ui/ListShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { useViewMode } from "@/components/ui/use-view-toggle";
import { IngredientTable, IngredientCards } from "@/components/ingredient/IngredientTable";

export const Route = createFileRoute("/ingredients/")({
  component: IngredientsPage,
});

function IngredientsPage() {
  const { data: ingredients, isLoading } = useIngredients();
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteIngredient(() => {
    queryClient.invalidateQueries({ queryKey: ik.lists() });
  });

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
