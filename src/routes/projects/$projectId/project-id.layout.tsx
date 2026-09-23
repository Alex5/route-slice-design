import { createFileRoute, Outlet } from "@tanstack/react-router";

import { ProjectTabs } from "#/routes/projects/$projectId/-components/project-tabs/project-tabs.tsx";
import { loadProject } from "#/routes/projects/$projectId/project-id.loader.ts";
import { useProject } from "#/shared/api/hooks/projects.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";

const FILE = "src/routes/projects/$projectId/project-id.layout.tsx";

/**
 * The project shell. It stays mounted while you move between Overview and
 * Tasks — that persistence is the entire reason layouts are separate files.
 */
function ProjectLayout() {
  const { projectId } = Route.useParams();
  const project = useProject({ projectId });

  return (
    <Boundary file={FILE} label="project-id.layout.tsx" className="space-y-6">
      <div className="flex items-baseline gap-3">
        <h1 className="text-sm font-semibold">{project.name}</h1>
        <span className="text-xs text-muted-foreground">открытых задач: {project.openTasks}</span>
      </div>
      <ProjectTabs projectId={projectId} />
      <Outlet />
    </Boundary>
  );
}

export const Route = createFileRoute("/projects/$projectId")({
  // Loads once for the whole subtree, before anything below renders.
  loader: loadProject,
  component: ProjectLayout,
});
