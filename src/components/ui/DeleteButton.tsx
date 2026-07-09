import { Trash2 } from "lucide-react";

export function DeleteButton({
  onDelete,
  confirmMsg = "Are you sure?",
}: {
  onDelete: () => void;
  confirmMsg?: string;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (confirm(confirmMsg)) {
          onDelete();
        }
      }}
      className="inline"
    >
      <button
        type="submit"
        className="btn btn-sm btn-ghost text-error hover:bg-error/10 min-w-[2.5rem] min-h-[2.5rem] justify-center"
        aria-label="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  );
}
