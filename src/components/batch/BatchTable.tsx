import { DeleteButton } from "@/components/ui/DeleteButton";
import type { BatchWithRecipe } from "@/lib/batches/use-batches";
import { getAbv, getAbvEstimate } from "@/lib/util";
import { Link } from "@tanstack/react-router";
import { Pencil } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PLANNING: "badge-ghost",
  FERMENTING: "badge-warning",
  CONDITIONING: "badge-warning",
  BOTTLED: "badge-success",
  COMPLETE: "badge-secondary",
};

export function BatchStatusBadge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] || "badge-ghost text-base-content/60";
  return (
    <span className={`badge ${colors}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
  );
}

function formatDate(d: Date | string | null) {
  return d ? new Date(d).toLocaleDateString() : "—";
}

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

// ── Cards ──────────────────────────────────────────────────────────────

export function BatchCards({
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {batches.map((batch) => (
        <div
          key={batch.id}
          className="card bg-base-100 border border-base-300 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onView && void window.location.assign(onView(batch.id))}
        >
          <div className="card-body p-4 sm:p-5 gap-2 sm:gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="font-semibold text-base-content text-sm sm:text-base truncate">
                {batch.recipe.name}
              </div>
              <div className="flex gap-1 shrink-0">
                <Link
                  to={onEdit(batch.id)}
                  className="btn btn-sm btn-ghost text-base-content/70 hover:text-primary"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <DeleteButton onDelete={onDelete(batch.id)} />
              </div>
            </div>

            <BatchStatusBadge status={batch.status} />

            <div className="grid grid-cols-[auto,1fr] gap-y-1 text-xs sm:text-sm text-base-content/80 mt-1 gap-x-2">
              {batch.batchSize != null && (
                <>
                  <span className="text-base-content/50">Size</span>
                  <span>{batch.batchSize} L</span>
                </>
              )}
              <span className="text-base-content/50">Start</span>
              <span>{formatDate(batch.startDate)}</span>
              {batch.ogReading != null && (
                <>
                  <span className="text-base-content/50">OG</span>
                  <span>{batch.ogReading}</span>
                </>
              )}
              {batch.fgReading != null && (
                <>
                  <span className="text-base-content/50">FG</span>
                  <span>{batch.fgReading}</span>
                </>
              )}
              {batch.ogReading != null && (
                <>
                  <span className="text-base-content/50">ABV</span>
                  <span>
                    {batch.fgReading != null
                      ? getAbv(batch.ogReading, batch.fgReading)
                      : getAbvEstimate(batch.ogReading)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
