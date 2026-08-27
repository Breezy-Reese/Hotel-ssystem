import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  css: {
    transformer: "postcss",
  },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    tsConfigPaths(),
    viteReact(),
  ],
});