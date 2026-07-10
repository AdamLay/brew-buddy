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
