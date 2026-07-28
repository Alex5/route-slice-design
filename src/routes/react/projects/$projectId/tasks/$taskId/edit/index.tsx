import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";

import { TaskFormFields } from "#/routes/react/projects/$projectId/tasks/-components/task-form/task-form-fields.tsx";
import { findTask } from "#/shared/api/mock-data.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { FormActions } from "#/shared/ui/form-actions/form-actions.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card/card.tsx";

const FILE = "src/routes/react/projects/$projectId/tasks/$taskId/edit/index.tsx";

function EditTaskPage() {
  const { projectId, taskId } = Route.useParams();
  const task = Route.useLoaderData();
  const navigate = useNavigate();

  const close = () =>
    navigate({ to: "/react/projects/$projectId/tasks/$taskId", params: { projectId, taskId } });

  return (
    <Boundary file={FILE} label="$taskId/edit/index.tsx" className="space-y-6">
      <h2 className="text-lg font-semibold tracking-tight">Edit task</h2>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskFormFields task={task} />
      </CardContent>
      </Card>
      <FormActions submitLabel="Save changes" onCancel={close} onSubmit={close} />
    </Boundary>
  );
}

export const Route = createFileRoute("/react/projects/$projectId/tasks/$taskId/edit/")({
  loader: ({ params }) => {
    const task = findTask(params.taskId);
    if (!task) throw notFound();
    return task;
  },
  component: EditTaskPage,
});
