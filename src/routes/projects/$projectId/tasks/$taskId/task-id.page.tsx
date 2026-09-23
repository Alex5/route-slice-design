import { createFileRoute, Link } from "@tanstack/react-router";

import { loadTask } from "#/routes/projects/$projectId/tasks/$taskId/task-id.loader.ts";
import { useTask } from "#/shared/api/hooks/tasks.ts";
import { TASK_STATUS_LABEL } from "#/shared/api/mock-data.ts";
import { Badge } from "#/shared/ui/badge/badge.tsx";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { Button } from "#/shared/ui/button/button.tsx";

const FILE = "src/routes/projects/$projectId/tasks/$taskId/task-id.page.tsx";

function TaskPage() {
  const { projectId, taskId } = Route.useParams();
  const task = useTask({ taskId });

  return (
    <Boundary file={FILE} label="task-id.page.tsx" className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <div className="font-mono text-xs text-muted-foreground">{task.id}</div>
          <h2 className="text-lg font-semibold tracking-tight">{task.title}</h2>
        </div>
        <Button asChild size="xs" variant="secondary">
          <Link to="/projects/$projectId/tasks/$taskId/edit" params={{ projectId, taskId }}>
            Редактировать
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

export const Route = createFileRoute("/projects/$projectId/tasks/$taskId/")({
  loader: loadTask,
  component: TaskPage,
});
