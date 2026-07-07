import { prisma } from "@/lib/db";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/recipes/$id/delete")({
  component: function DeletePage() { return null; },
});

// ponytail: use POST instead of GET for mutations to prevent CSRF and accidental deletion
export async function loader({ params, request }: { params: { id: string }; request: Request }) {
  if (request.method !== "POST") {
    throw redirect({ to: "/recipes" });
  }
  await prisma.recipe.delete({ where: { id: params.id } });
  throw redirect({ to: "/recipes" });
}
