import { useNavigate } from "@tanstack/react-router";

import { TASK_STATUS_LABEL, type Task } from "#/shared/api/mock-data.ts";
import { Badge } from "#/shared/ui/badge/badge.tsx";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { DataTable, type Column } from "#/shared/ui/data-table/data-table.tsx";
import { Skeleton } from "#/shared/ui/skeleton/skeleton.tsx";

const FILE = "src/routes/projects/$projectId/tasks/_components/tasks-table/tasks-table.tsx";

const columns: Column<Task>[] = [
  {
    key: "id",
    header: "Ключ",
    cell: (task) => <span className="font-mono text-layer-routes">{task.id}</span>,
  },
  {
    key: "title",
    header: "Задача",
    cell: () => <Skeleton className="h-2.5 w-full animate-none" />,
    className: "w-full",
  },
  {
    key: "status",
    header: "Статус",
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
        empty="Под этот фильтр задач нет"
        onOpen={(task) =>
          navigate({
            to: "/projects/$projectId/tasks/$taskId",
            params: { projectId, taskId: task.id },
          })
        }
      />
    </Boundary>
  );
}
