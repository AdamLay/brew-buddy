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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content">{title}</h1>
        <div className="flex gap-2 items-center w-full sm:w-auto">
          {actions}
          <Link
            to={addHref as any}
            className="btn btn-primary btn-sm sm:btn-normal w-full sm:w-auto justify-center"
          >
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
