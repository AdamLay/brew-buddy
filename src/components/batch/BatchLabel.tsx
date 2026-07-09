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
      className="bg-white border-2 border-black rounded-lg p-4 shadow-sm w-[12cm] h-[5.5cm]"
      style={{ maxWidth: "480px" }}
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
          <h3 className="font-bold title-font text-lg leading-tight text-zinc-900">{recipeName}</h3>
          <p className="text-sm text-zinc-500 mb-2">{brewType}</p>

          <div className="text-sm space-y-0.5">
            <p>
              <span className="font-medium text-zinc-700">Start:</span>{" "}
              <span className="font-medium text-zinc-500">{formattedDate}</span>
            </p>
          </div>

          {notes && <p className="text-sm mt-2 leading-snug text-zinc-700">{notes}</p>}
        </div>
      </div>
    </div>
  );
}
