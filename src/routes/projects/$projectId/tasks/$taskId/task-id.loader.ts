import type { QueryClient } from "@tanstack/react-query";

import { notFound } from "@tanstack/react-router";

import { taskQueryOptions } from "#/shared/api/hooks/tasks.ts";
import { ApiError } from "#/shared/api/mock-data.ts";

/**
 * Loads one task. Both the task page and its edit page need it, so the loader
 * sits in their common segment, $taskId — lifted on the second use (Т4).
 */
export async function loadTask({
  context,
  params,
}: {
  context: { queryClient: QueryClient };
  params: { taskId: string };
}) {
  try {
    return await context.queryClient.query({
      ...taskQueryOptions({ taskId: params.taskId }),
      staleTime: "static",
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) throw notFound();
    throw error;
  }
}
