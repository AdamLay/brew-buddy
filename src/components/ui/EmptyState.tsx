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
    <div className="text-center py-16 bg-base-100 rounded-xl border border-base-300">
      <p className="text-base-content/60 text-lg mb-4">{message}</p>
      <a href={buttonHref} className="btn btn-primary">
        <Plus className="w-4 h-4 mr-1" />
        {buttonText}
      </a>
    </div>
  );
}
