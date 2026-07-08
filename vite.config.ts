import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Vite config for Astro's internal use (dev server only)
export default defineConfig({
  plugins: [tailwindcss(), react()],
});
