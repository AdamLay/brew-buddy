import { Calendar } from "lucide-react";

export interface BatchUpdate {
  id: string;
  batchId: string;
  timestamp: string;
  notes?: string | null;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BatchUpdatesListProps {
  updates: BatchUpdate[];
}

function formatDateTime(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function BatchUpdatesList({ updates }: BatchUpdatesListProps) {
  if (!updates || updates.length === 0) {
    return (
      <div className="text-center py-8 text-base-content/40">
        <Calendar className="w-12 h-12 mx-auto mb-2" />
        <p className="text-sm">No updates yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {updates.map((update) => (
        <div key={update.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-primary mt-1.5" />
            <div className="w-px flex-1 bg-base-content/10 my-1" />
          </div>
          <div className="flex-1 pb-6">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3.5 h-3.5 text-base-content/50" />
              <span className="text-xs text-base-content/50">
                {formatDateTime(update.timestamp)}
              </span>
            </div>
            {update.image && (
              <div className="mt-2 mb-2">
                <img
                  src={update.image}
                  alt="Batch update"
                  className="max-w-xs rounded-lg border border-base-200"
                />
              </div>
            )}
            {update.notes && (
              <p className="text-sm text-base-content/80 whitespace-pre-wrap">{update.notes}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
