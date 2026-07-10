import { getAbvFromReading } from "#/lib/util.ts";
import { QRCodeSVG } from "qrcode.react";

interface BatchLabelProps {
  recipeName: string;
  brewType: string;
  startDate: Date | string;
  notes: string | null;
  batchId: string;
  ogReading?: number | null;
}

export function BatchLabel({
  recipeName,
  brewType,
  startDate,
  notes,
  batchId,
  ogReading,
}: BatchLabelProps) {
  const baseUrl = (import.meta.env.VITE_BASE_URL as string) || "http://localhost:3000";
  const batchUrl = `${baseUrl}/batches/${batchId}`;
  const formattedDate = new Date(startDate).toLocaleDateString();

  return (
    <div
      data-label
      className="bg-white border-2 border-black rounded-lg p-4 shadow-sm w-[12cm] flex items-center"
    >
      <div className="flex flex-1 gap-4">
        {/* Left: QR code */}
        <div className="flex items-center gap-2 shrink-0">
          <QRCodeSVG value={batchUrl} size={140} bgColor="#ffffff" fgColor="#000000" />
          {/* <span className="text-[10px] text-black/50">{batchUrl}</span> */}
        </div>

        {/* Right: label info */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold title-font text-lg leading-tight text-amber-800">
              {recipeName}
            </h3>

            <div className="text-sm flex justify-between">
              <p>
                <span className="font-medium text-zinc-700">Start:</span>{" "}
                <span className="font-medium text-zinc-500">{formattedDate}</span>
              </p>
              <p className="text-sm text-right text-zinc-500">{brewType}</p>
            </div>

            {ogReading && (
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm leading-snug text-zinc-700">
                  <span className="font-medium text-zinc-700">OG:</span> {ogReading}
                </p>
                <p className="text-sm text-right leading-snug text-zinc-700">
                  <span className="font-medium text-zinc-700">ABV:</span>{" "}
                  {getAbvFromReading(ogReading).toFixed(1)}%
                </p>
              </div>
            )}
            {notes && <p className="text-sm leading-snug text-zinc-700">{notes}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
