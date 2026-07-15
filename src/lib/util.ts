export const getAbvEstimate = (ogReading: number) => {
  return "~" + ((ogReading - 1.0) * 131.25).toFixed(1) + "%";
};

export const getAbv = (og: number, fg: number) => {
  return ((og - fg) * 131.25).toFixed(1) + "%";
};

export function formatDate(d: Date | string | null) {
  return d ? new Date(d).toLocaleDateString() : "—";
}

export function getBatchAge(startDate: Date | string | null): string {
  if (!startDate) return "—";
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = Math.abs(now.getTime() - start.getTime());
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1 day";
  if (days < 7) return `${days} days`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 week";
  if (weeks < 4) return `${weeks} weeks`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1 month";
  if (months < 12) return `${months} month${months > 1 ? "s" : ""}`;
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? "s" : ""}`;
}
