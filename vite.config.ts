import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { index, rootRoute, route, type VirtualRouteNode } from "@tanstack/virtual-file-routes";
import react from "@vitejs/plugin-react";
import { copyFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";

/**
 * GitHub Pages serves a project site from /<repo>/, so the base has to match.
 * CI sets it; locally it stays at the root.
 */
const base = process.env.BASE_PATH ?? "/";

const ROUTES = "src/routes";

/** The file in `dir` carrying a route role, e.g. `tasks.page.tsx`. */
function roleFile(dir: string, role: "page" | "layout") {
  return readdirSync(join(ROUTES, dir), { withFileTypes: true }).find(
    (entry) => entry.isFile() && entry.name.endsWith(`.${role}.tsx`),
  )?.name;
}

/**
 * The route tree, read from folders (Т1, Т5): a folder is a URL segment,
 * `*.page.tsx` is what that URL shows, `*.layout.tsx` wraps everything below it.
 * Dash-prefixed folders and every other file are not routes.
 *
 * The generator's own convention wants `index.tsx` / `route.tsx` and splits
 * file names on dots, so `projects/projects.page.tsx` would come out as
 * `/projects/projects`. Describing the tree to it keeps the names honest.
 */
function routesIn(dir: string): VirtualRouteNode[] {
  const page = roleFile(dir, "page");

  const folders = readdirSync(join(ROUTES, dir), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("-"))
    .map((entry) => {
      const path = join(dir, entry.name);
      const layout = roleFile(path, "layout");
      const children = routesIn(path);
      return layout
        ? route(`/${entry.name}`, join(path, layout), children)
        : route(`/${entry.name}`, children);
    });

  return [...(page ? [index(join(dir, page))] : []), ...folders];
}

/**
 * The tree is read once per config load, so adding or removing a page
 * restarts the dev server to read it again.
 */
function restartOnRouteChange(): Plugin {
  return {
    name: "restart-on-route-change",
    apply: "serve",
    configureServer: (server) => {
      function onChange(file: string) {
        if (file.includes(`/${ROUTES}/`) && /\.(page|layout)\.tsx$/.test(file)) server.restart();
      }
      server.watcher.on("add", onChange).on("unlink", onChange);
    },
  };
}

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
    tanstackRouter({
      target: "react",
      autoCodeSplitting: false,
      virtualRouteConfig: rootRoute("__root.tsx", routesIn("")),
    }),
    restartOnRouteChange(),
    react(),
    tailwindcss(),
    spaFallback(),
  ],
  resolve: {
    alias: {
      "#": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
