import { useNavigate } from "@tanstack/react-router";

import { TASK_STATUS_LABEL, type Task } from "#/shared/api/mock-data.ts";
import { Badge } from "#/shared/ui/badge/badge.tsx";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { DataTable, type Column } from "#/shared/ui/data-table/data-table.tsx";
import { Skeleton } from "#/shared/ui/skeleton/skeleton.tsx";

const FILE =
  "src/routes/react/projects/$projectId/tasks/-components/tasks-table/tasks-table.tsx";

const columns: Column<Task>[] = [
  {
    key: "id",
    header: "Key",
    cell: (task) => <span className="font-mono text-layer-routes">{task.id}</span>,
  },
  {
    key: "title",
    header: "Task",
    cell: () => <Skeleton className="h-2.5 w-full animate-none" />,
    className: "w-full",
  },
  {
    key: "status",
    header: "Status",
    cell: (task) => <Badge variant="secondary">{TASK_STATUS_LABEL[task.status]}</Badge>,
    className: "text-end",
  },
];

export function TasksTable({ projectId, rows }: { projectId: string; rows: Task[] }) {
  const navigate = useNavigate();

  return (
    <Boundary file={FILE} label="tasks-table">
      <DataTable
        rows={rows}
        columns={columns}
        getKey={(task) => task.id}
        empty="No tasks match this filter"
        onOpen={(task) =>
          navigate({
            to: "/react/projects/$projectId/tasks/$taskId",
            params: { projectId, taskId: task.id },
          })
        }
      />
    </Boundary>
  );
}
