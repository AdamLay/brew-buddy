import { renderLabelToBlob } from "#/lib/label-capture.ts";
import type { BatchWithRecipe } from "@/lib/batches/use-batches";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

export default function DownloadLabelButton({ batch }: { batch: BatchWithRecipe }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!batch) return;
    setDownloading(true);
    try {
      const blob = await renderLabelToBlob({
        recipeName: batch.recipe.name,
        brewType: batch.recipe.brewType,
        startDate: batch.startDate,
        notes: batch.notes,
        batchId: batch.id,
        baseUrl: (import.meta.env.VITE_BASE_URL as string) || "http://localhost:3000",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `label-${batch.recipe.name.toLowerCase().replace(/\s+/g, "-")}.jpg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button className="btn btn-secondary gap-2" onClick={handleDownload} disabled={downloading}>
      {downloading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {downloading ? "Generating..." : "Download Label as JPG"}
    </button>
  );
}
