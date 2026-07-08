import { Link } from "@tanstack/react-router";
import { Pencil } from "lucide-react";

export function DataCard({
  id,
  editHref,
  children,
  actions,
}: {
  id?: string;
  editHref?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div
      key={id}
      className="card bg-base-100 border border-base-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="card-body p-4 gap-2">
        {children}
        {(editHref || actions) && (
          <div className="flex gap-2 justify-end mt-2 pt-2 border-t border-base-200">
            {editHref && (
              <Link
                to={editHref as any}
                className="btn btn-sm btn-ghost text-base-content/70 hover:text-primary"
              >
                <Pencil className="w-4 h-4" />
              </Link>
            )}
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
