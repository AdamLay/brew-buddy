import { prisma } from "@/lib/db";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ingredients/$id/delete")({
  server: {
    handlers: {
      POST: async ({ params }) => {
        await prisma.ingredient.delete({ where: { id: params.id } });
        return new Response(null, { status: 302, headers: { Location: "/ingredients" } });
      },
    },
  },
});
