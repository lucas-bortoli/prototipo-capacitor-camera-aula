import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
