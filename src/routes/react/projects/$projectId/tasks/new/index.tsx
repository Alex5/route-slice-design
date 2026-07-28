import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { TaskFormFields } from "#/routes/react/projects/$projectId/tasks/-components/task-form/task-form-fields.tsx";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { FormActions } from "#/shared/ui/form-actions/form-actions.tsx";
import { Section } from "#/shared/ui/section/section.tsx";

const FILE = "src/routes/react/projects/$projectId/tasks/new/index.tsx";

function AddTaskPage() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();

  const close = () => navigate({ to: "/react/projects/$projectId/tasks", params: { projectId } });

  return (
    <Boundary file={FILE} label="tasks/new/index.tsx" className="space-y-6">
      <h2 className="text-lg font-semibold tracking-tight">New task</h2>
      <Section title="Details">
        <TaskFormFields />
      </Section>
      <FormActions submitLabel="Create task" onCancel={close} onSubmit={close} />
    </Boundary>
  );
}

export const Route = createFileRoute("/react/projects/$projectId/tasks/new/")({
  component: AddTaskPage,
});
