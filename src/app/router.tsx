import { createRouter } from "@tanstack/react-router";

import { routeTree } from "#/routeTree.gen.ts";

/**
 * The route tree is generated from the folders under src/routes, so no route is
 * ever listed by hand here. Renaming a folder changes the URL and breaks every
 * <Link> that pointed at it, at compile time.
 */
export const router = createRouter({
  routeTree,
  // Vite's BASE_URL carries a trailing slash; the router wants none.
  basepath: import.meta.env.BASE_URL.replace(/\/$/, ""),
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
