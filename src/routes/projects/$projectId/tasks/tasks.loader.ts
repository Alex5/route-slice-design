import type { QueryClient } from "@tanstack/react-query";

import { tasksQueryOptions } from "#/shared/api/hooks/tasks.ts";

/** The task list; the page filters it by the status in the URL (Т7). */
export function loadTasks({ context }: { context: { queryClient: QueryClient } }) {
  return context.queryClient.query({ ...tasksQueryOptions(), staleTime: "static" });
}
