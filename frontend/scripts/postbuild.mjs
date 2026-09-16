// O Vite limpa `dist/` a cada build (emptyOutDir), então os arquivos abaixo
// (necessários para o deploy no GitHub Pages) precisam ser recriados sempre
// depois do build:
// - 404.html: cópia do index.html, permite que rotas do React Router
//   (ex.: /tickets/123, /public/t/<token>) funcionem em acesso direto.
// - .nojekyll: evita que o GitHub Pages processe o conteúdo com Jekyll.
import { copyFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const distDir = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");

copyFileSync(join(distDir, "index.html"), join(distDir, "404.html"));
writeFileSync(join(distDir, ".nojekyll"), "");
