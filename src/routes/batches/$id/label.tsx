import { prisma } from "@/lib/db";
import { BatchLabel } from "@/components/batch/BatchLabel";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getBatch = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return prisma.batch.findUnique({
      where: { id: data.id },
      include: { recipe: { select: { id: true, name: true, brewType: true } } },
    });
  });

export const Route = createFileRoute("/batches/$id/label")({
  component: BatchLabelPage,
  loader: async ({
    params,
  }): Promise<{ batch: NonNullable<Awaited<ReturnType<typeof getBatch>>> }> => {
    const batch = await getBatch({ data: { id: params.id } });
    if (!batch) {
      throw new Error("NOT_FOUND");
    }
    return { batch };
  },
});

function BatchLabelPage() {
  const loaderData = Route.useLoaderData();
  const batch = loaderData.batch;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BatchLabel
        recipeName={batch.recipe.name}
        brewType={batch.recipe.brewType}
        startDate={batch.startDate}
        notes={batch.notes}
        batchId={batch.id}
      />

      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
