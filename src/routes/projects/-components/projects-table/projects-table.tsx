import { useNavigate } from "@tanstack/react-router";

import { projects } from "#/shared/api/mock-data.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { DataTable } from "#/shared/ui/data-table/data-table.tsx";
import { Skeleton } from "#/shared/ui/skeleton/skeleton.tsx";

const FILE = "src/routes/projects/-components/projects-table/projects-table.tsx";

/**
 * Reads its own data instead of receiving it through props, so the page above
 * stays free of plumbing.
 */
export function ProjectsTable() {
  const navigate = useNavigate();

  return (
    <Boundary file={FILE} label="-components/projects-table">
      <DataTable
        rows={projects}
        getKey={(project) => project.id}
        onOpen={(project) =>
          navigate({ to: "/projects/$projectId", params: { projectId: project.id } })
        }
        renderRow={(project) => (
          <>
            <span className="w-24 shrink-0 font-medium text-layer-routes">{project.name}</span>
            <Skeleton className="flex-1" />
            <span className="w-16 shrink-0 text-end text-muted-foreground">
              {project.openTasks} open
            </span>
          </>
        )}
      />
    </Boundary>
  );
}
