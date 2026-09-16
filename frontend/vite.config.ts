import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => ({
  // Em build de produção, o site é servido em
  // https://<user>.github.io/PipelineMovieDeskJIRA/ (GitHub Pages de projeto).
  // Em dev mantém a raiz para não afetar o fluxo local.
  base: command === "build" ? "/PipelineMovieDeskJIRA/" : "/",
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
}));
