import { DeleteButton } from "@/components/ui/DeleteButton";
import type { BatchWithRecipe } from "@/lib/batches/use-batches";
import { formatDate, getAbv, getAbvEstimate, getBatchAge } from "@/lib/util";
import { Link } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { BatchStatusBadge } from "./BatchStatusBadge";

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
          <div className="card-body gap-2">
            <div className="flex items-center justify-between gap-1">
              <div className="font-semibold text-base-content text-sm sm:text-base truncate">
                {batch.recipe.name} ({batch.batchSize != null ? `${batch.batchSize}L` : "—"})
              </div>
              <div className="flex gap-1 shrink-0">
                <Link
                  to={onEdit(batch.id)}
                  className="btn btn-ghost text-base-content/70 hover:text-primary"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <DeleteButton onDelete={onDelete(batch.id)} />
              </div>
            </div>

            <BatchStatusBadge status={batch.status} />

            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-base-content/80 mt-1">
              <p>
                <span className="text-base-content/50 mr-1">Start</span>
                <span>{formatDate(batch.startDate)}</span>
              </p>
              <p>
                <span className="text-base-content/50 mr-1">Age</span>
                <span>{getBatchAge(batch.startDate)}</span>
              </p>
              {batch.ogReading != null && (
                <p>
                  <span className="text-base-content/50 mr-1">OG</span>
                  <span>{batch.ogReading}</span>
                </p>
              )}
              {batch.fgReading != null && (
                <p>
                  <span className="text-base-content/50 mr-1">FG</span>
                  <span>{batch.fgReading}</span>
                </p>
              )}
              {batch.ogReading != null && (
                <p>
                  <span className="text-base-content/50 mr-1">ABV</span>
                  <span>
                    {batch.fgReading != null
                      ? getAbv(batch.ogReading, batch.fgReading)
                      : getAbvEstimate(batch.ogReading)}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
