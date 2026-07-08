import QRCode from "qrcode";

const FONTS = {
  heading: 'bold 18px "Plus Jakarta Sans", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  body: '14px "Plus Jakarta Sans", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  label: '14px "Plus Jakarta Sans", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  small: '10px "Plus Jakarta Sans", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  notes: '13px "Plus Jakarta Sans", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
};

const COLORS = {
  dark: "#000000",
  gray: "#6b6b6b",
  lightGray: "#888888",
  bg: "#ffffff",
};

interface LabelOptions {
  recipeName: string;
  brewType: string;
  startDate: Date | string;
  notes: string | null;
  batchId: string;
  baseUrl: string;
}

const LABEL_WIDTH = 440;
const LABEL_PADDING = 16;
const LABEL_GAP = 24;
const QR_SIZE = 140;
const BORDER_RADIUS = 8;

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): { y: number; lines: string[] } {
  const words = text.split(/\s+/);
  let line = "";
  let newY = y;

  for (const word of words) {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line !== "") {
      ctx.fillText(line.trim(), x, newY);
      line = word + " ";
      newY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, newY);
  return { y: newY, lines: [] };
}

export async function renderLabelToBlob(options: LabelOptions): Promise<Blob> {
  const { recipeName, brewType, startDate, notes, batchId, baseUrl } = options;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // Estimate height based on content
  const hasNotes = !!notes && notes.trim().length > 0;
  const noteLines = hasNotes ? notes!.split(/\s+/).length : 0;
  const noteHeight = hasNotes ? Math.min(noteLines, 4) * 18 : 0;
  const textAreaHeight = 80 + noteHeight;
  const labelHeight = Math.max(textAreaHeight, QR_SIZE + 30);

  const canvasWidth = LABEL_WIDTH;
  const canvasHeight = labelHeight + LABEL_PADDING * 2;
  const scale = 2;

  canvas.width = canvasWidth * scale;
  canvas.height = canvasHeight * scale;
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  ctx.scale(scale, scale);

  // White background
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Rounded border
  ctx.strokeStyle = COLORS.dark;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(1, 1, canvasWidth - 2, canvasHeight - 2, BORDER_RADIUS);
  ctx.stroke();

  // === QR Code ===
  const batchUrl = `${baseUrl}/batches/${batchId}`;
  const qrDataUrl = await QRCode.toDataURL(batchUrl, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: QR_SIZE,
    type: "image/png" as never,
  });

  const qrX = LABEL_PADDING;
  const qrCenterY = canvasHeight / 2;
  const qrImg = await loadImage(qrDataUrl);
  ctx.drawImage(qrImg, qrX, qrCenterY - QR_SIZE / 2, QR_SIZE, QR_SIZE);

  // QR URL text below
  ctx.font = FONTS.small;
  ctx.fillStyle = COLORS.lightGray;
  ctx.textAlign = "center";
  ctx.fillText(batchUrl, qrX + QR_SIZE / 2, qrCenterY + QR_SIZE / 2 + 14);

  // === Text (right side) ===
  const textX = qrX + QR_SIZE + LABEL_GAP;
  const textWidth = canvasWidth - LABEL_PADDING - LABEL_GAP - QR_SIZE - LABEL_PADDING;
  let textY = LABEL_PADDING + 16;

  // Recipe name
  ctx.font = FONTS.heading;
  ctx.fillStyle = COLORS.dark;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(recipeName, textX, textY);
  textY += 28;

  // Brew type
  ctx.font = FONTS.body;
  ctx.fillStyle = COLORS.gray;
  ctx.fillText(brewType, textX, textY);
  textY += 26;

  // Start date
  ctx.font = FONTS.label;
  ctx.fillStyle = COLORS.gray;
  const d = new Date(startDate);
  const dateStr = d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  ctx.fillText(dateStr, textX, textY);
  textY += 24;

  // Notes
  if (notes && notes.trim()) {
    textY += 6;
    ctx.font = FONTS.notes;
    ctx.fillStyle = COLORS.gray;
    wrapText(ctx, notes.trim(), textX, textY, textWidth, 18);
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create blob"));
      },
      "image/jpeg",
      0.95,
    );
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
