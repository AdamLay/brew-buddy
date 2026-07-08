import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import reactDev from "@vitejs/plugin-react";

export default defineConfig({
  integrations: [
    react({
      jsxImportSource: "react",
      vite: {
        plugins: [reactDev()],
      },
    }),
  ],
  adapter: node({
    mode: "prerender",
  }),
  vite: {
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["react", "react-dom", "@hookform/resolvers", "qrcode"],
    },
    build: {
      rollupOptions: {
        external: ["@prisma/client", "@prisma/adapter-pg"],
      },
    },
  },
});
