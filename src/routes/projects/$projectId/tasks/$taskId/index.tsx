import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { findTask, TASK_STATUS_LABEL } from "#/shared/api/mock-data.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { Pill } from "#/shared/ui/pill/pill.tsx";

const FILE = "src/routes/projects/$projectId/tasks/$taskId/index.tsx";

function TaskPage() {
  const { projectId, taskId } = Route.useParams();
  const task = Route.useLoaderData();

  return (
    <Boundary file={FILE} label="$taskId/index.tsx" className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <div className="font-mono text-xs text-muted-foreground">{task.id}</div>
          <h2 className="text-lg font-semibold tracking-tight">{task.title}</h2>
        </div>
        <Link
          to="/projects/$projectId/tasks/$taskId/edit"
          params={{ projectId, taskId }}
          className="rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground transition-colors hover:bg-accent"
        >
          Edit
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <Pill active>{TASK_STATUS_LABEL[task.status]}</Pill>
        <span>{task.assignee}</span>
      </div>
    </Boundary>
  );
}

export const Route = createFileRoute("/projects/$projectId/tasks/$taskId/")({
  loader: ({ params }) => {
    const task = findTask(params.taskId);
    if (!task) throw notFound();
    return task;
  },
  component: TaskPage,
});
