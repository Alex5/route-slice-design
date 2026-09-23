import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { loadTask } from "#/routes/projects/$projectId/tasks/$taskId/task-id.loader.ts";
import { TaskFormFields } from "#/routes/projects/$projectId/tasks/-components/task-form/task-form-fields.tsx";
import { useTask } from "#/shared/api/hooks/tasks.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card/card.tsx";
import { FormActions } from "#/shared/ui/form-actions/form-actions.tsx";

const FILE = "src/routes/projects/$projectId/tasks/$taskId/edit/edit.page.tsx";

function EditTaskPage() {
  const { projectId, taskId } = Route.useParams();
  const task = useTask({ taskId });
  const navigate = useNavigate();

  function close() {
    navigate({ to: "/projects/$projectId/tasks/$taskId", params: { projectId, taskId } });
  }

  return (
    <Boundary file={FILE} label="edit.page.tsx" className="space-y-6">
      <h2 className="text-lg font-semibold tracking-tight">Редактирование задачи</h2>
      <Card>
        <CardHeader>
          <CardTitle>Детали</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskFormFields task={task} />
        </CardContent>
      </Card>
      <FormActions submitLabel="Сохранить" onCancel={close} onSubmit={close} />
    </Boundary>
  );
}

export const Route = createFileRoute("/projects/$projectId/tasks/$taskId/edit/")({
  loader: loadTask,
  component: EditTaskPage,
});
