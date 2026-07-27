import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

import { ProjectTabs } from "#/routes/projects/$projectId/-components/project-tabs/project-tabs.tsx";
import { findProject } from "#/shared/api/mock-data.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";

const FILE = "src/routes/projects/$projectId/route.tsx";

/**
 * The project shell. It stays mounted while you move between Overview and
 * Tasks — that persistence is the entire reason layouts are separate files.
 */
function ProjectLayout() {
  const { projectId } = Route.useParams();
  const project = Route.useLoaderData();

  return (
    <Boundary file={FILE} label="$projectId/route.tsx" className="space-y-6">
      <div className="flex items-baseline gap-3">
        <h1 className="text-sm font-semibold">{project.name}</h1>
        <span className="text-xs text-muted-foreground">{project.openTasks} open tasks</span>
      </div>
      <ProjectTabs projectId={projectId} />
      <Outlet />
    </Boundary>
  );
}

export const Route = createFileRoute("/projects/$projectId")({
  // Loads once for the whole subtree, before anything below renders.
  loader: ({ params }) => {
    const project = findProject(params.projectId);
    if (!project) throw notFound();
    return project;
  },
  component: ProjectLayout,
});
