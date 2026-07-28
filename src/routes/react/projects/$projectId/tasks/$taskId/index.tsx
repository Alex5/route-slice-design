import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { findTask, TASK_STATUS_LABEL } from "#/shared/api/mock-data.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { Button } from "#/shared/ui/button/button.tsx";
import { Badge } from "#/shared/ui/badge/badge.tsx";

const FILE = "src/routes/react/projects/$projectId/tasks/$taskId/index.tsx";

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
        <Button asChild size="xs" variant="secondary">
        <Link
            to="/react/projects/$projectId/tasks/$taskId/edit"
            params={{ projectId, taskId }}
          >
            Edit
          </Link>
      </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <Badge variant="secondary">{TASK_STATUS_LABEL[task.status]}</Badge>
        <span>{task.assignee}</span>
      </div>
    </Boundary>
  );
}

export const Route = createFileRoute("/react/projects/$projectId/tasks/$taskId/")({
  loader: ({ params }) => {
    const task = findTask(params.taskId);
    if (!task) throw notFound();
    return task;
  },
  component: TaskPage,
});
