import { deleteRecipeFn, useRecipes } from "#/lib/recipes/use-recipes";
import { recipeKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ListShell } from "@/components/ui/ListShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { useViewMode } from "@/components/ui/use-view-toggle";
import { RecipeTable, RecipeCards } from "@/components/recipe/RecipeTable";

export const Route = createFileRoute("/recipes/")({
  component: RecipesPage,
});

function RecipesPage() {
  const { data: recipes, isLoading } = useRecipes();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRecipeFn(id as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });

  const [viewMode, toggleView] = useViewMode("recipes");

  const emptyContent = (
    <EmptyState
      message="No recipes yet. Create your first recipe!"
      buttonText="Create Recipe"
      buttonHref="/recipes/new"
    />
  );

  if (!recipes || recipes.length === 0) {
    return (
      <ListShell
        title="Recipes"
        addButtonText="New Recipe"
        addHref="/recipes/new"
        isLoading={isLoading}
      >
        {emptyContent}
      </ListShell>
    );
  }

  return (
    <>
      <ListShell
        title="Recipes"
        addButtonText="New Recipe"
        addHref="/recipes/new"
        isLoading={isLoading}
        actions={<ViewToggle mode={viewMode} onToggle={toggleView} />}
      >
        {viewMode === "table" ? (
          <RecipeTable
            recipes={recipes}
            onEdit={(id) => `/recipes/${id}/edit`}
            onDelete={(id) => () => deleteMutation.mutate(id)}
          />
        ) : (
          <RecipeCards
            recipes={recipes}
            onEdit={(id) => `/recipes/${id}/edit`}
            onDelete={(id) => () => deleteMutation.mutate(id)}
          />
        )}
      </ListShell>
    </>
  );
}
