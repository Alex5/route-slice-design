import { getRouteApi } from "@tanstack/react-router";

import { TASK_STATUS_LABEL, TASK_STATUSES, type TaskStatus } from "#/shared/api/mock-data.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { Button } from "#/shared/ui/button/button.tsx";

const FILE =
  "src/routes/react/projects/$projectId/tasks/-components/filters/status-filter.tsx";

// getRouteApi instead of importing the route file: the component reaches the
// route it lives under without a sibling import.
const route = getRouteApi("/react/projects/$projectId/tasks/");

/**
 * Filter state lives in the route's search params, not in useState — watch the
 * address bar. The link survives a reload and can be handed to someone else.
 */
export function StatusFilter() {
  const { status } = route.useSearch();
  const navigate = route.useNavigate();

  const setStatus = (next?: TaskStatus) =>
    navigate({ search: (previous) => ({ ...previous, status: next }) });

  return (
    <Boundary file={FILE} label="filters" className="pb-3 pt-6">
      <div className="flex flex-wrap gap-2">
        <Button
          size="xs"
          variant={status ? "secondary" : "default"}
          onClick={() => setStatus(undefined)}
        >
          Any status
        </Button>
        {TASK_STATUSES.map((value) => (
          <Button
            key={value}
            size="xs"
            variant={status === value ? "default" : "secondary"}
            onClick={() => setStatus(value)}
          >
            {TASK_STATUS_LABEL[value]}
          </Button>
        ))}
      </div>
    </Boundary>
  );
}
