import { prisma } from "@/lib/db";

// GET /api/batch-updates - List updates for a batch
export function GET(request: Request) {
  return fetchBatchUpdates(request);
}

// POST /api/batch-updates - Create batch update
export function POST(request: Request) {
  return createBatchUpdate(request);
}

async function fetchBatchUpdates(request: Request) {
  const url = new URL(request.url);
  const batchId = url.searchParams.get("batchId");
  if (!batchId) {
    return new Response(JSON.stringify({ error: "batchId required" }), { status: 400 });
  }
  try {
    const updates = await prisma.batchUpdate.findMany({
      where: { batchId },
      orderBy: { timestamp: "desc" },
    });
    return new Response(JSON.stringify(updates), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function createBatchUpdate(request: Request) {
  try {
    const body = await request.json();
    const data = body as any;
    const result = await prisma.batchUpdate.create({
      data: {
        batchId: data.batchId,
        timestamp: data.timestamp || new Date(),
        notes: data.notes || null,
        image: data.image || null,
      },
    });
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    if (err instanceof Error && "errors" in err) {
      return new Response(JSON.stringify({ error: (err as any).errors[0].message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
