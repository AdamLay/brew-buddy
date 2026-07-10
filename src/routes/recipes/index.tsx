import { useCloneRecipe, useDeleteRecipe, useRecipes } from "#/lib/recipes/use-recipes";
import { RecipeCards, RecipeTable } from "@/components/recipe/RecipeTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListShell } from "@/components/ui/ListShell";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { useViewMode } from "@/components/ui/use-view-toggle";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/recipes/")({
  component: RecipesPage,
});

function RecipesPage() {
  const { data: recipes, isLoading } = useRecipes();
  const navigate = useNavigate();
  const deleteMutation = useDeleteRecipe();
  const cloneMutation = useCloneRecipe((newRecipeId: string) => {
    void navigate({ to: `/recipes/${newRecipeId}/edit` });
  });

  const handleCopy = (id: string) => {
    if (confirm("Copy this recipe? The copy will include all ingredients.")) {
      cloneMutation.mutate(id);
    }
  };

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
            onCopy={handleCopy}
            onDelete={(id) => () => deleteMutation.mutate(id)}
          />
        ) : (
          <RecipeCards
            recipes={recipes}
            onEdit={(id) => `/recipes/${id}/edit`}
            onCopy={handleCopy}
            onDelete={(id) => () => deleteMutation.mutate(id)}
          />
        )}
      </ListShell>
    </>
  );
}
