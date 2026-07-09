import { QRCodeSVG } from "qrcode.react";

interface BatchLabelProps {
  recipeName: string;
  brewType: string;
  startDate: Date | string;
  notes: string | null;
  batchId: string;
}

export function BatchLabel({ recipeName, brewType, startDate, notes, batchId }: BatchLabelProps) {
  const baseUrl = (import.meta.env.VITE_BASE_URL as string) || "http://localhost:3000";
  const batchUrl = `${baseUrl}/batches/${batchId}`;
  const formattedDate = new Date(startDate).toLocaleDateString();

  return (
    <div
      data-label
      className="border-2 border-black rounded-lg p-4"
      style={{
        maxWidth: "480px",
      }}
    >
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
        {/* Left: QR code */}
        <div
          className="shrink-0"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}
        >
          <QRCodeSVG value={batchUrl} size={140} bgColor="#ffffff" fgColor="#000000" />
          {/* <span className="text-[10px] text-black/50">{batchUrl}</span> */}
        </div>

        {/* Right: label info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg leading-tight">{recipeName}</h3>
          <p className="text-sm text-black/60 mb-2">{brewType}</p>

          <div className="text-sm space-y-0.5">
            <p>
              <span className="font-medium text-black/60">Start:</span> {formattedDate}
            </p>
          </div>

          {notes && <p className="text-sm mt-2 leading-snug">{notes}</p>}
        </div>
      </div>
    </div>
  );
}
