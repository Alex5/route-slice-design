import { createRouter } from "@tanstack/react-router";

import { WithProviders } from "#/app/providers/with-providers.tsx";
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
  // Провайдеры подключает app, а не __root: routes не импортирует app (Т2).
  // InnerWrap, а не Wrap — провайдерам нужны хуки роутера.
  InnerWrap: WithProviders,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
