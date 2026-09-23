import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { fetchProject, fetchProjects } from "#/shared/api/mock-data.ts";

/*
 * Query options and hooks for projects — the part a real app would generate
 * from the OpenAPI contract (orval, kubb) next to the client (Т8, Т9). Loaders
 * take the options to fill the cache; components call the hooks and never see
 * a query key.
 */

export function projectsQueryOptions() {
  return queryOptions({ queryKey: ["projects"], queryFn: fetchProjects });
}

export function projectQueryOptions({ projectId }: { projectId: string }) {
  return queryOptions({
    queryKey: ["projects", projectId],
    queryFn: () => fetchProject(projectId),
  });
}

export function useProjects() {
  return useSuspenseQuery(projectsQueryOptions()).data;
}

export function useProject({ projectId }: { projectId: string }) {
  return useSuspenseQuery(projectQueryOptions({ projectId })).data;
}
