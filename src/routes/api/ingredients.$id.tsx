import { prisma } from "@/lib/db";
import { createFileRoute } from "@tanstack/react-router";
import { ingredientSchema, parseIngredientFormData } from "@/lib/ingredient-validation";

export const Route = createFileRoute("/api/ingredients/$id")({
  server: {
    handlers: {
      POST: async ({ params, request }) => {
        if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });

        const existing = await prisma.ingredient.findUnique({ where: { id: params.id } });
        if (!existing) {
          return new Response(null, { status: 302, headers: { Location: "/ingredients" } });
        }

        const formData = await request.formData();
        const data = parseIngredientFormData(formData);

        const parsed = ingredientSchema.safeParse(data);
        if (!parsed.success) {
          console.error("Validation failed:", parsed.error.issues[0]?.message);
          return new Response(null, { status: 302, headers: { Location: `/ingredients/${params.id}/edit` } });
        }

        await prisma.ingredient.update({ where: { id: params.id }, data: parsed.data });
        return new Response(null, { status: 302, headers: { Location: "/ingredients" } });
      },
    },
  },
});
