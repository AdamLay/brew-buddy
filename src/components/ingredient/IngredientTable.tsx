import type { IngredientWithCount } from "#/lib/ingredients/use-ingredients";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { Link } from "@tanstack/react-router";
import { Pencil } from "lucide-react";

function formatType(type: string | null) {
  if (!type) return null;
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

function truncate(text: string | null, max: number) {
  if (!text) return "—";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

// ── Table ──────────────────────────────────────────────────────────────

export function IngredientTable({
  ingredients,
  onEdit,
  onDelete,
}: {
  ingredients: IngredientWithCount[];
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
                <th className="text-base-content font-semibold">Description</th>
                <th className="text-base-content font-semibold">Price</th>
                <th className="text-base-content font-semibold">Used In</th>
                <th className="text-base-content font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200">
              {ingredients.map((ingredient) => (
                <tr key={ingredient.id} className="hover">
                  <td>
                    <div className="font-medium text-base-content">{ingredient.name}</div>
                  </td>
                  <td>
                    {ingredient.type ? (
                      <span className="badge badge-outline text-secondary">
                        {formatType(ingredient.type)}
                      </span>
                    ) : (
                      <span className="text-base-content/40">—</span>
                    )}
                  </td>
                  <td className="text-sm text-base-content/70">
                    {truncate(ingredient.description, 60)}
                  </td>
                  <td>
                    {ingredient.defaultPrice != null
                      ? `£${ingredient.defaultPrice.toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="text-base-content">{ingredient._count.recipes}</td>
                  <td className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link
                        to={onEdit(ingredient.id)}
                        className="btn btn-sm btn-ghost text-base-content/70 hover:text-primary hover:bg-base-200"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteButton onDelete={onDelete(ingredient.id)} />
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

// ── Cards ──────────────────────────────────────────────────────────────

export function IngredientCards({
  ingredients,
  onEdit,
  onDelete,
}: {
  ingredients: IngredientWithCount[];
  onEdit: (id: string) => string;
  onDelete: (id: string) => () => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {ingredients.map((ingredient) => (
        <div
          key={ingredient.id}
          className="card bg-base-100 border border-base-300 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="card-body p-5 gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="font-semibold text-base-content text-lg truncate">
                {ingredient.name}
              </div>
              <div className="flex gap-1 shrink-0">
                <Link
                  to={onEdit(ingredient.id)}
                  className="btn btn-sm btn-ghost text-base-content/70 hover:text-primary"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <DeleteButton onDelete={onDelete(ingredient.id)} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {ingredient.type && (
                <span className="badge badge-outline text-secondary mt-1">
                  {formatType(ingredient.type)}
                </span>
              )}

              {ingredient.defaultPrice != null && (
                <div className="text-sm font-medium text-base-content">
                  £{ingredient.defaultPrice.toFixed(2)}
                </div>
              )}
            </div>

            {ingredient.description && (
              <p className="text-sm text-base-content/60 line-clamp-2 mt-auto">
                {truncate(ingredient.description, 100)}
              </p>
            )}

            <div className="text-sm text-base-content/60 mt-1">
              Used in {ingredient._count.recipes} recipe{ingredient._count.recipes !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
