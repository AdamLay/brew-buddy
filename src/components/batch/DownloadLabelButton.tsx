import { BatchLabel } from "@/components/batch/BatchLabel";
import type { BatchWithRecipe } from "@/lib/batches/use-batches";
import { Download, Loader2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";

export default function DownloadLabelButton({ batch }: { batch: BatchWithRecipe }) {
  const [downloading, setDownloading] = useState(false);
  const hiddenRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!batch || !hiddenRef.current || downloading) return;
    setDownloading(true);
    try {
      const element = hiddenRef.current.querySelector("[data-label]");
      if (!element) return;

      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,
        useCORS: true,
      });

      canvas.toBlob(
        (blob: Blob | null) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `label-${batch.recipe.name.toLowerCase().replace(/\s+/g, "-")}.jpg`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        },
        "image/jpeg",
        0.95,
      );
    } finally {
      setDownloading(false);
    }
  }, [batch, downloading]);

  return (
    <>
      <div ref={hiddenRef} style={{ position: "absolute", left: "-9999px" }}>
        <div style={{ width: "500px" }}>
          <BatchLabel
            recipeName={batch.recipe.name}
            brewType={batch.recipe.brewType}
            startDate={batch.startDate}
            notes={batch.notes}
            batchId={batch.id}
          />
        </div>
      </div>

      <button
        className="btn btn-secondary gap-2 w-full sm:w-auto justify-center sm:justify-start"
        onClick={handleDownload}
        disabled={downloading}
      >
        {downloading ? (
          <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
        ) : (
          <Download className="w-4 h-4 shrink-0" />
        )}
        <span className="hidden sm:inline">
          {downloading ? "Generating..." : "Download Label as JPG"}
        </span>
        <span className="sm:hidden">{downloading ? "..." : "Download"}</span>
      </button>
    </>
  );
}
