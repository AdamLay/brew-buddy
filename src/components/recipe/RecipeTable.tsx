import { Pencil } from "lucide-react";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { Link } from "@tanstack/react-router";
import type { RecipeWithCount } from "#/lib/recipes/use-recipes";

export function RecipeTable({
  recipes,
  onEdit,
  onDelete,
}: {
  recipes: RecipeWithCount[];
  onEdit: (id: string) => string;
  onDelete: (id: string) => () => void;
}) {
  return (
    <div className="card bg-base-100 shadow-lg border border-base-300">
      <div className="card-body p-0">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="text-base-content font-semibold">Name</th>
                <th className="text-base-content font-semibold">Type</th>
                <th className="text-base-content font-semibold">Batches</th>
                <th className="text-base-content font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200">
              {recipes.map((recipe) => (
                <tr key={recipe.id} className="hover">
                  <td>
                    <div>
                      <div className="font-medium text-base-content">{recipe.name}</div>
                      {recipe.description && (
                        <div
                          className={`text-sm text-base-content/60 ${recipe.description.length > 80 ? "truncate max-w-xs" : ""}`}
                        >
                          {recipe.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-accent">
                      {recipe.brewType.charAt(0).toUpperCase() +
                        recipe.brewType.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="text-base-content">{recipe._count.batches}</td>
                  <td className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link
                        to={onEdit(recipe.id) as any}
                        className="btn btn-sm btn-ghost text-base-content/70 hover:text-primary hover:bg-base-200"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteButton onDelete={onDelete(recipe.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function RecipeCards({
  recipes,
  onEdit,
  onDelete,
}: {
  recipes: RecipeWithCount[];
  onEdit: (id: string) => string;
  onDelete: (id: string) => () => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="card bg-base-100 border border-base-300 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="card-body p-4 sm:p-5 gap-2 sm:gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="font-semibold text-base-content text-base sm:text-lg truncate">
                {recipe.name}
              </div>
              <div className="flex gap-1 shrink-0">
                <Link
                  to={onEdit(recipe.id) as any}
                  className="btn btn-sm btn-ghost text-base-content/70 hover:text-primary"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <DeleteButton onDelete={onDelete(recipe.id)} />
              </div>
            </div>

            {recipe.description && (
              <p className="text-sm text-base-content/60 line-clamp-2">
                {recipe.description.length > 80
                  ? recipe.description.slice(0, 80) + "..."
                  : recipe.description}
              </p>
            )}

            <div className="flex items-center gap-2 mt-auto flex-wrap">
              <span className="badge badge-accent badge-sm">
                {recipe.brewType.charAt(0).toUpperCase() + recipe.brewType.slice(1).toLowerCase()}
              </span>
              <span className="text-xs sm:text-sm text-base-content/60">
                {recipe._count.batches} batch{recipe._count.batches !== 1 ? "es" : ""}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
