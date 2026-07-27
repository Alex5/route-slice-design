import type { ReactNode } from "react";

import { ExplorerProvider } from "#/shared/explorer/explorer.context.tsx";

/**
 * One assembly point for providers. Nesting order is visible in a single file
 * instead of being smeared across main.tsx.
 */
export function WithProviders({ children }: { children: ReactNode }) {
  return <ExplorerProvider>{children}</ExplorerProvider>;
}
