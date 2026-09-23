import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ExplorerProvider } from "#/shared/ui/explorer/explorer.context.tsx";

/**
 * The one cache for server state. Loaders reach it through the router context,
 * components through the provider below — the same instance either way.
 */
export const queryClient = new QueryClient();

/**
 * One assembly point for providers. Nesting order is visible in a single file
 * instead of being smeared across main.tsx.
 */
export function WithProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ExplorerProvider>{children}</ExplorerProvider>
    </QueryClientProvider>
  );
}
