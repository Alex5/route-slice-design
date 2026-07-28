import { useId } from "react";

import type { Task } from "#/shared/api/mock-data.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { Input } from "#/shared/ui/input/input.tsx";
import { Label } from "#/shared/ui/label/label.tsx";

const FILE =
  "src/routes/react/projects/$projectId/tasks/-components/task-form/task-form-fields.tsx";

/**
 * Lifted here on the second use, not before.
 *
 * Both task forms need these fields and their nearest common ancestor is
 * tasks/, so the block sits one level up rather than in shared/. It knows what
 * a Task is, which is exactly what disqualifies it from shared/ui (§ 5).
 */
export function TaskFormFields({ task }: { task?: Task }) {
  const id = useId();

  return (
    <Boundary file={FILE} label="-components/task-form" className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${id}-title`}>Title</Label>
        <Input id={`${id}-title`} defaultValue={task?.title} placeholder="What needs doing?" />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-assignee`}>Assignee</Label>
        <Input id={`${id}-assignee`} defaultValue={task?.assignee} placeholder="Unassigned" />
      </div>
    </Boundary>
  );
}
