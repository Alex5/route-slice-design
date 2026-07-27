import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { copyFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";

/**
 * GitHub Pages serves a project site from /<repo>/, so the base has to match.
 * CI sets it; locally it stays at the root.
 */
const base = process.env.BASE_PATH ?? "/";

/**
 * Pages has no server-side rewrite, so a direct hit on /projects/apollo/tasks
 * would 404. Serving the same document as 404.html hands those URLs back to the
 * client router.
 */
function spaFallback(): Plugin {
  let outDir = "dist";

  return {
    name: "spa-fallback-404",
    apply: "build",
    configResolved: (config) => {
      outDir = config.build.outDir;
    },
    closeBundle: () => {
      copyFileSync(join(outDir, "index.html"), join(outDir, "404.html"));
    },
  };
}

export default defineConfig({
  base,
  plugins: [
    // Runs before the React plugin: it generates routeTree.gen.ts from the
    // folders under src/routes, which is what makes the tree on the left and
    // the URL in the address bar the same thing.
    tanstackRouter({ target: "react", autoCodeSplitting: false }),
    react(),
    tailwindcss(),
    spaFallback(),
  ],
  resolve: {
    alias: {
      "#package": fileURLToPath(new URL("./package.json", import.meta.url)),
      "#": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
