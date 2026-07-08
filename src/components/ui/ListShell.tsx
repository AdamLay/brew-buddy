import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export function ListShell({
  title,
  addButtonText,
  addHref,
  isLoading,
  actions,
  children,
}: {
  title: string;
  addButtonText: string;
  addHref: string;
  isLoading: boolean;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-base-content">{title}</h1>
        <div className="flex gap-2 items-center">
          {actions}
          <Link to={addHref as any} className="btn btn-primary">
            <Plus className="w-4 h-4 mr-1" />
            {addButtonText}
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : (
        children
      )}
    </>
  );
}
