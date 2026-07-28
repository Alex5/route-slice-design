import { getRouteApi } from "@tanstack/react-router";

import { TASK_STATUS_LABEL, TASK_STATUSES, type TaskStatus } from "#/shared/api/mock-data.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { Pill } from "#/shared/ui/pill/pill.tsx";

const FILE = "src/routes/react/projects/$projectId/tasks/-components/filters/status-filter.tsx";

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
    <Boundary file={FILE} label="-components/filters" className="pb-3 pt-6">
      <div className="flex flex-wrap gap-2">
        <Pill active={!status} onClick={() => setStatus(undefined)}>
          Any status
        </Pill>
        {TASK_STATUSES.map((value) => (
          <Pill key={value} active={status === value} onClick={() => setStatus(value)}>
            {TASK_STATUS_LABEL[value]}
          </Pill>
        ))}
      </div>
    </Boundary>
  );
}
