import type { QueryClient } from "@tanstack/react-query";

import { projectsQueryOptions } from "#/shared/api/hooks/projects.ts";

/**
 * Fills the cache before /projects renders (Т7); the table then reads it with
 * useProjects(). `staleTime: "static"` takes whatever the cache already holds
 * and fetches only when it holds nothing.
 */
export function loadProjects({ context }: { context: { queryClient: QueryClient } }) {
  return context.queryClient.query({ ...projectsQueryOptions(), staleTime: "static" });
}
