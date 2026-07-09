import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export function EmptyState({
  message,
  buttonText,
  buttonHref,
}: {
  message: string;
  buttonText: string;
  buttonHref: string;
}) {
  return (
    <div className="text-center py-12 sm:py-16 bg-base-100 rounded-xl border border-base-300 px-4 sm:px-0">
      <p className="text-base-content/60 text-base sm:text-lg mb-4">{message}</p>
      <Link to={buttonHref as any} className="btn btn-primary w-full sm:w-auto justify-center">
        <Plus className="w-4 h-4 mr-1" />
        {buttonText}
      </Link>
    </div>
  );
}
