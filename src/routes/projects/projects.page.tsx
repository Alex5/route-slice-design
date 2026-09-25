import { createFileRoute } from "@tanstack/react-router";

import { AddProjectButton } from "#/routes/projects/_components/add-project-button/add-project-button.tsx";
import { ProjectsTable } from "#/routes/projects/_components/projects-table/projects-table.tsx";
import { loadProjects } from "#/routes/projects/projects.loader.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";

const FILE = "src/routes/projects/projects.page.tsx";

/** A page is an orchestrator: heading, list, action. No logic of its own. */
function ProjectsPage() {
  return (
    <Boundary file={FILE} label="projects.page.tsx" className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Проекты</h2>
        <AddProjectButton />
      </div>
      <ProjectsTable />
    </Boundary>
  );
}

export const Route = createFileRoute("/projects/")({
  loader: loadProjects,
  component: ProjectsPage,
});
