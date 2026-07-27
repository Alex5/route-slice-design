import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { Skeleton } from "#/shared/ui/skeleton/skeleton.tsx";
import type { Task } from "#/shared/api/mock-data.ts";

const FILE = "src/routes/projects/$projectId/tasks/-components/task-form/task-form-fields.tsx";

const FIELDS = ["Title", "Description", "Assignee"] as const;

/**
 * Lifted here on the second use, not before.
 *
 * Both task forms need these fields and their nearest common ancestor is
 * tasks/, so the block sits one level up rather than in shared/. It knows what
 * a Task is, which is exactly what disqualifies it from shared/ui (§ 5).
 */
export function TaskFormFields({ task }: { task?: Task }) {
  return (
    <Boundary file={FILE} label="-components/task-form" className="space-y-4">
      {FIELDS.map((field) => (
        <div key={field} className="space-y-2">
          <div className="text-[11px] text-muted-foreground">{field}</div>
          <div className="flex h-8 items-center rounded-md border border-white/10 px-2.5">
            {task && <Skeleton className="w-1/2" />}
          </div>
        </div>
      ))}
    </Boundary>
  );
}
