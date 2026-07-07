import { prisma } from "@/lib/db";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/api/ingredients/$id")({
  component: function ApiPage() { return null; },
});

function parseFormData(formData: FormData) {
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || undefined;
  const type = (formData.get("type") as string) || undefined;

  return {
    name,
    description: description || null,
    type: type || null,
  };
}

export async function loader({ params, request }: { params: { id: string }; request: Request }) {
  if (request.method !== "POST") return {};

  const formData = await request.formData();
  const data = parseFormData(formData);

  if (!data.name.trim()) {
    console.error("Validation failed: Name is required");
    throw redirect({ to: `/ingredients/${params.id}/edit` as any });
  }

  await prisma.ingredient.update({ where: { id: params.id }, data });
  throw redirect({ to: "/ingredients" });
}
