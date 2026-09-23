import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { fetchTask, fetchTasks } from "#/shared/api/mock-data.ts";

/* Query options and hooks for tasks; see projects.ts for why they live here. */

export function tasksQueryOptions() {
  return queryOptions({ queryKey: ["tasks"], queryFn: fetchTasks });
}

export function taskQueryOptions({ taskId }: { taskId: string }) {
  return queryOptions({
    queryKey: ["tasks", taskId],
    queryFn: () => fetchTask(taskId),
  });
}

export function useTasks() {
  return useSuspenseQuery(tasksQueryOptions()).data;
}

export function useTask({ taskId }: { taskId: string }) {
  return useSuspenseQuery(taskQueryOptions({ taskId })).data;
}
