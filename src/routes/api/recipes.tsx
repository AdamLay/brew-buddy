import { prisma } from "@/lib/db";
import { createFileRoute } from "@tanstack/react-router";
import { recipeSchema } from "@/lib/recipe-validation";

function parseFormData(formData: FormData) {
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || undefined;
  const brewType = formData.get("brewType") as string;
  const instructions = (formData.get("instructions") as string) || undefined;

  const ogStr = formData.get("originalGravity") as string;
  const fgStr = formData.get("finalGravity") as string;
  const bsStr = formData.get("batchSize") as string;

  return {
    name,
    description,
    brewType,
    instructions,
    originalGravity: ogStr ? parseFloat(ogStr) : null,
    finalGravity: fgStr ? parseFloat(fgStr) : null,
    batchSize: bsStr ? parseFloat(bsStr) : null,
  };
}

export const Route = createFileRoute("/api/recipes")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });

        const formData = await request.formData();
        const data = parseFormData(formData);

        const parsed = recipeSchema.safeParse(data);
        if (!parsed.success) {
          const firstError = parsed.error.issues[0]?.message ?? "Validation failed";
          return new Response(null, { status: 302, headers: { Location: `/recipes/new?error=${encodeURIComponent(firstError)}` } });
        }

        await prisma.recipe.create({ data: parsed.data });
        return new Response(null, { status: 302, headers: { Location: "/recipes" } });
      },
    },
  },
});
