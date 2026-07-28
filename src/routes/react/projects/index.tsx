import { createFileRoute } from "@tanstack/react-router";

import { AddProjectButton } from "#/routes/react/projects/-components/add-project-button/add-project-button.tsx";
import { ProjectsTable } from "#/routes/react/projects/-components/projects-table/projects-table.tsx";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";

const FILE = "src/routes/react/projects/index.tsx";

/** A page is an orchestrator: heading, list, action. No logic of its own. */
function ProjectsPage() {
  return (
    <Boundary file={FILE} label="projects/index.tsx" className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Projects</h2>
        <AddProjectButton />
      </div>
      <ProjectsTable />
    </Boundary>
  );
}

export const Route = createFileRoute("/react/projects/")({
  component: ProjectsPage,
});
