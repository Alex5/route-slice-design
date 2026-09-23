import { useNavigate } from "@tanstack/react-router";

import type { Project } from "#/shared/api/mock-data.ts";

import { useProjects } from "#/shared/api/hooks/projects.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { DataTable, type Column } from "#/shared/ui/data-table/data-table.tsx";
import { Skeleton } from "#/shared/ui/skeleton/skeleton.tsx";

const FILE = "src/routes/projects/-components/projects-table/projects-table.tsx";

const columns: Column<Project>[] = [
  {
    key: "name",
    header: "Проект",
    cell: (project) => <span className="font-medium text-layer-routes">{project.name}</span>,
  },
  {
    key: "summary",
    header: "Описание",
    cell: () => <Skeleton className="h-2.5 w-full animate-none" />,
    className: "w-full",
  },
  {
    key: "open",
    header: "Открыто",
    cell: (project) => <span className="text-muted-foreground">{project.openTasks}</span>,
    className: "text-end",
  },
];

/**
 * Reads its own data and owns its own navigation, so the page above stays free
 * of plumbing.
 */
export function ProjectsTable() {
  const navigate = useNavigate();
  const projects = useProjects();

  return (
    <Boundary file={FILE} label="projects-table">
      <DataTable
        rows={projects}
        columns={columns}
        getKey={(project) => project.id}
        onOpen={(project) =>
          navigate({ to: "/projects/$projectId", params: { projectId: project.id } })
        }
      />
    </Boundary>
  );
}
