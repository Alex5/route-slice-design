import { createFileRoute } from "@tanstack/react-router";

import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { Skeleton } from "#/shared/ui/skeleton/skeleton.tsx";

const FILE = "src/routes/projects/$projectId/project-id.page.tsx";

function ProjectOverviewPage() {
  return (
    <Boundary file={FILE} label="project-id.page.tsx" className="space-y-5">
      <h2 className="text-lg font-semibold tracking-tight">Обзор</h2>
      <div className="space-y-2.5">
        <Skeleton className="w-full" />
        <Skeleton className="w-4/5" />
      </div>
    </Boundary>
  );
}

export const Route = createFileRoute("/projects/$projectId/")({
  component: ProjectOverviewPage,
});
