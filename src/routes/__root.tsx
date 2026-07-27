import { createRootRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Columns2 } from "lucide-react";

import { SiteHeader } from "#/routes/-components/site-header/site-header.tsx";
import { WithProviders } from "#/app/providers/with-providers.tsx";
import { Explorer } from "#/shared/explorer/explorer.tsx";
import { NotePanel } from "#/shared/explorer/note-panel.tsx";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";

const FILE = "src/routes/__root.tsx";

/**
 * The shell every URL renders inside: the file tree on the left, an <Outlet/>
 * on the right. A real root layout, which is why the tree keeps its scroll and
 * expansion state as you navigate.
 */
function RootLayout() {
  return (
    <WithProviders>
      <div className="flex h-dvh flex-col bg-background">
        <SiteHeader />

        {/* Source on the left, the running app in the middle, and the note about
            whatever is outlined on the right — next to the thing it describes. */}
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(260px,320px)_1fr] lg:grid-cols-[minmax(260px,320px)_1fr_minmax(260px,340px)]">
          <Explorer />
          <main className="min-h-0 p-4">
            <Preview />
          </main>
          <div className="hidden min-h-0 flex-col lg:flex">
            <NotePanel />
          </div>
        </div>
      </div>
    </WithProviders>
  );
}

function Preview() {
  const { pathname, search } = useLocation();
  const query = new URLSearchParams(search as Record<string, string>).toString();

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-background">
      <div className="flex h-10 shrink-0 items-center gap-3 border-b px-4">
        {/* The real address bar, not a drawing of one. */}
        <div className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
          {window.location.host}
          <span className="text-foreground">
            {pathname}
            {query && `?${query}`}
          </span>
        </div>
        <Link
          to="/compare"
          className="flex h-6 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          activeProps={{ className: "bg-accent text-accent-foreground" }}
        >
          <Columns2 className="size-3" />
          Compare twins
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <Boundary file={FILE} label="__root.tsx">
          <Outlet />
        </Boundary>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
