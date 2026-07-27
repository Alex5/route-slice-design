import { useNavigate } from "@tanstack/react-router";

import { TASK_STATUS_LABEL, type Task } from "#/shared/api/mock-data.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { DataTable } from "#/shared/ui/data-table/data-table.tsx";
import { Skeleton } from "#/shared/ui/skeleton/skeleton.tsx";

const FILE = "src/routes/projects/$projectId/tasks/-components/tasks-table/tasks-table.tsx";

export function TasksTable({ projectId, rows }: { projectId: string; rows: Task[] }) {
  const navigate = useNavigate();

  return (
    <Boundary file={FILE} label="-components/tasks-table">
      <DataTable
        rows={rows}
        getKey={(task) => task.id}
        empty="No tasks match this filter"
        onOpen={(task) =>
          navigate({
            to: "/projects/$projectId/tasks/$taskId",
            params: { projectId, taskId: task.id },
          })
        }
        renderRow={(task) => (
          <>
            <span className="w-16 shrink-0 font-mono text-layer-routes">{task.id}</span>
            <Skeleton className="flex-1" />
            <span className="w-20 shrink-0 text-end text-muted-foreground">
              {TASK_STATUS_LABEL[task.status]}
            </span>
          </>
        )}
      />
    </Boundary>
  );
}
