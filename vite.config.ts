import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tailwindcss(), imagetools()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    target: "es2022",
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: "gsap", test: /node_modules[\\/]gsap/ },
            {
              name: "react",
              test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/,
            },
          ],
        },
      },
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
