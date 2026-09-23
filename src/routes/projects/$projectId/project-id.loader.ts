import type { QueryClient } from "@tanstack/react-query";

import { notFound } from "@tanstack/react-router";

import { projectQueryOptions } from "#/shared/api/hooks/projects.ts";
import { ApiError } from "#/shared/api/mock-data.ts";

/** Loads the project once for the layout and everything under it (Т7). */
export async function loadProject({
  context,
  params,
}: {
  context: { queryClient: QueryClient };
  params: { projectId: string };
}) {
  try {
    return await context.queryClient.query({
      ...projectQueryOptions({ projectId: params.projectId }),
      staleTime: "static",
    });
  } catch (error) {
    // A 404 from the API is this URL's not-found page; anything else stays an error.
    if (error instanceof ApiError && error.status === 404) throw notFound();
    throw error;
  }
}
