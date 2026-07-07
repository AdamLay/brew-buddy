import { prisma } from "@/lib/db";
import { createFileRoute } from "@tanstack/react-router";
import { ingredientSchema, parseIngredientFormData } from "@/lib/ingredient-validation";

export const Route = createFileRoute("/api/ingredients")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });

        const formData = await request.formData();
        const data = parseIngredientFormData(formData);

        const parsed = ingredientSchema.safeParse(data);
        if (!parsed.success) {
          const firstError = parsed.error.issues[0]?.message ?? "Validation failed";
          return new Response(null, { status: 302, headers: { Location: `/ingredients/new?error=${encodeURIComponent(firstError)}` } });
        }

        await prisma.ingredient.create({ data: parsed.data });
        return new Response(null, { status: 302, headers: { Location: "/ingredients" } });
      },
    },
  },
});
