import { createFileRoute, Link } from "@tanstack/react-router";

import { StatusFilter } from "#/routes/projects/$projectId/tasks/-components/filters/status-filter.tsx";
import { TasksTable } from "#/routes/projects/$projectId/tasks/-components/tasks-table/tasks-table.tsx";
import { tasks, TASK_STATUSES, type TaskStatus } from "#/shared/api/mock-data.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";

const FILE = "src/routes/projects/$projectId/tasks/index.tsx";

function TasksPage() {
  const { projectId } = Route.useParams();
  const { status } = Route.useSearch();

  const rows = status ? tasks.filter((task) => task.status === status) : tasks;

  return (
    <Boundary file={FILE} label="tasks/index.tsx" className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Tasks</h2>
        <Link
          to="/projects/$projectId/tasks/new"
          params={{ projectId }}
          className="rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground transition-colors hover:bg-accent"
        >
          New task
        </Link>
      </div>
      <StatusFilter />
      <TasksTable projectId={projectId} rows={rows} />
    </Boundary>
  );
}

export const Route = createFileRoute("/projects/$projectId/tasks/")({
  // The filter is part of the URL, so it is validated where the URL is defined.
  validateSearch: (search: Record<string, unknown>): { status?: TaskStatus } => {
    const status = search.status;
    return TASK_STATUSES.includes(status as TaskStatus) ? { status: status as TaskStatus } : {};
  },
  component: TasksPage,
});
