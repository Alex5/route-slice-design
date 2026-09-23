import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { TaskFormFields } from "#/routes/projects/$projectId/tasks/-components/task-form/task-form-fields.tsx";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card/card.tsx";
import { FormActions } from "#/shared/ui/form-actions/form-actions.tsx";

const FILE = "src/routes/projects/$projectId/tasks/new/new.page.tsx";

function AddTaskPage() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();

  function close() {
    navigate({ to: "/projects/$projectId/tasks", params: { projectId } });
  }

  return (
    <Boundary file={FILE} label="new.page.tsx" className="space-y-6">
      <h2 className="text-lg font-semibold tracking-tight">Новая задача</h2>
      <Card>
        <CardHeader>
          <CardTitle>Детали</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskFormFields />
        </CardContent>
      </Card>
      <FormActions submitLabel="Создать задачу" onCancel={close} onSubmit={close} />
    </Boundary>
  );
}

export const Route = createFileRoute("/projects/$projectId/tasks/new/")({
  component: AddTaskPage,
});
