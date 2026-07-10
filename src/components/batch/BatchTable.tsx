import { DeleteButton } from "@/components/ui/DeleteButton";
import type { BatchWithRecipe } from "@/lib/batches/use-batches";
import { formatDate, getAbv, getAbvEstimate } from "@/lib/util";
import { Link } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { BatchStatusBadge } from "./BatchStatusBadge";

function nullable(v: number | null | undefined) {
  return v ?? "—";
}

// ── Table ──────────────────────────────────────────────────────────────

export function BatchTable({
  batches,
  onView,
  onEdit,
  onDelete,
}: {
  batches: BatchWithRecipe[];
  onView?: (id: string) => string;
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
                <th className="text-base-content font-semibold">Recipe</th>
                <th className="text-base-content font-semibold">Status</th>
                <th className="text-base-content font-semibold">Size (L)</th>
                <th className="text-base-content font-semibold">Start</th>
                <th className="text-base-content font-semibold">OG</th>
                <th className="text-base-content font-semibold">FG</th>
                <th className="text-base-content font-semibold">ABV</th>
                <th className="text-base-content font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200">
              {batches.map((batch) => (
                <tr
                  key={batch.id}
                  className="hover cursor-pointer"
                  onClick={() => onView && void window.location.assign(onView(batch.id))}
                >
                  <td>
                    <div className="font-medium text-base-content">{batch.recipe.name}</div>
                    {batch.recipe.brewType && (
                      <div className="text-xs text-base-content/50">
                        {batch.recipe.brewType.toLowerCase()}
                      </div>
                    )}
                  </td>
                  <td>
                    <BatchStatusBadge status={batch.status} />
                  </td>
                  <td className="text-base-content">{nullable(batch.batchSize)}</td>
                  <td className="text-base-content">{formatDate(batch.startDate)}</td>
                  <td className="text-base-content">{nullable(batch.ogReading)}</td>
                  <td className="text-base-content">{nullable(batch.fgReading)}</td>
                  <td className="text-base-content">
                    {batch.ogReading != null
                      ? batch.fgReading != null
                        ? getAbv(batch.ogReading, batch.fgReading)
                        : getAbvEstimate(batch.ogReading)
                      : "—"}
                  </td>
                  <td className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link
                        to={onEdit(batch.id)}
                        className="btn btn-sm btn-ghost text-base-content/70 hover:text-primary hover:bg-base-200"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteButton onDelete={onDelete(batch.id)} />
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
