import { Link } from "@tanstack/react-router";

import { cn } from "#/shared/lib/utils.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";

const FILE = "src/routes/projects/$projectId/-components/project-tabs/project-tabs.tsx";

const linkClass =
  "rounded-md px-2.5 py-1 text-xs transition-colors bg-secondary text-secondary-foreground hover:bg-accent";
const activeClass = "bg-primary text-primary-foreground hover:bg-primary";

/**
 * Not one string path in JSX: <Link to> is typed by the generated route tree,
 * so renaming a folder breaks the build instead of the app.
 */
export function ProjectTabs({ projectId }: { projectId: string }) {
  return (
    <Boundary file={FILE} label="-components/project-tabs" className="pb-3 pt-6">
      <div className="flex items-center gap-2">
        <Link
          to="/projects/$projectId"
          params={{ projectId }}
          activeOptions={{ exact: true }}
          className={linkClass}
          activeProps={{ className: cn(linkClass, activeClass) }}
        >
          Overview
        </Link>
        <Link
          to="/projects/$projectId/tasks"
          params={{ projectId }}
          className={linkClass}
          activeProps={{ className: cn(linkClass, activeClass) }}
        >
          Tasks
        </Link>
      </div>
    </Boundary>
  );
}
