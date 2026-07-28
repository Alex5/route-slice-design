import { createRootRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Columns2 } from "lucide-react";

import { WithProviders } from "#/app/providers/with-providers.tsx";
import { SiteHeader } from "#/routes/-components/site-header/site-header.tsx";
import { cn } from "#/shared/lib/utils.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { useExplorer } from "#/shared/ui/explorer/explorer.context.tsx";
import { Explorer } from "#/shared/ui/explorer/explorer.tsx";
import { NotePanel } from "#/shared/ui/explorer/note-panel.tsx";
import { SourceView } from "#/shared/ui/source-view/source-view.tsx";

const FILE = "src/routes/__root.tsx";

const tabClass = "rounded px-2 py-0.5 text-[11px] text-muted-foreground transition-colors";
const activeTabClass = "bg-secondary text-foreground";

/**
 * The shell every URL renders inside: the file tree on the left, an <Outlet/>
 * on the right. A real root layout, which is why the tree keeps its scroll and
 * expansion state as you navigate.
 */
function RootLayout() {
  const { source } = Route.useSearch();

  return (
    <WithProviders>
      <div className="flex h-dvh flex-col bg-background">
        <SiteHeader />

        {/* Source on the left, the running app in the middle, and the note about
            whatever is outlined on the right — next to the thing it describes. */}
        <div className="grid min-h-0 flex-1 grid-cols-12">
          <Explorer />
          <main className="min-h-0 p-4 col-span-6">
            <Preview source={source} />
          </main>
          <div className="hidden min-h-0 flex-col lg:flex col-span-3">
            <NotePanel />
          </div>
        </div>
      </div>
    </WithProviders>
  );
}

function Preview({ source }: { source?: string }) {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { selectedPath } = useExplorer();

  const showSource = (path: string | null) =>
    navigate({
      to: ".",
      search: (previous: Record<string, unknown>) => ({ ...previous, source: path ?? undefined }),
    });

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
        {/* Two views of the same route: what it renders, and what renders it. */}
        <div className="flex shrink-0 items-center gap-0.5 rounded-md border border-white/10 p-0.5">
          <button
            type="button"
            onClick={() => showSource(null)}
            className={cn(tabClass, !source && activeTabClass)}
          >
            Preview
          </button>
          <button
            type="button"
            disabled={!selectedPath}
            onClick={() => showSource(selectedPath)}
            className={cn(tabClass, source && activeTabClass, !selectedPath && "opacity-40")}
          >
            Code
          </button>
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

      {source ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex h-9 shrink-0 items-center gap-3 border-b bg-card/40 px-4">
            <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">
              {source}
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            <SourceView path={source} />
          </div>
        </div>
      ) : (
      <div className="flex-1 overflow-y-auto p-8">
          <Boundary file={FILE} label="__root.tsx">
            <Outlet />
          </Boundary>
        </div>
      )}
    </div>
  );
}

/**
 * Reached by typing a URL nothing answers — including the tempting
 * `/board/board.store`, which looks like a route but is a role file.
 */
function NotFound() {
  return (
    <div className="space-y-3 rounded-lg border border-dashed border-white/10 p-6">
      <h2 className="text-sm font-semibold">Nothing answers this URL</h2>
      <p className="max-w-prose text-xs leading-relaxed text-muted-foreground">
        Only folders under <code>routes/</code> become addresses. A folder starting with a dash is
        excluded, and a file carrying a role in a dot suffix — <code>board.store.ts</code>,{" "}
        <code>wizard.context.tsx</code> — is not a route either. The tree on the left prints a URL
        beside the files that have one.
      </p>
      <Link to="/react/projects" className="inline-block text-xs text-layer-routes hover:underline">
        Back to /projects
      </Link>
    </div>
  );
}

export const Route = createRootRoute({
  // A file being read is part of the address, so the view can be linked to —
  // the same rule the task filter follows.
  validateSearch: (search: Record<string, unknown>): { source?: string } =>
    typeof search.source === "string" ? { source: search.source } : {},
  component: RootLayout,
  notFoundComponent: NotFound,
});
