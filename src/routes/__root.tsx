import type { QueryClient } from "@tanstack/react-query";

import {
  createRootRouteWithContext,
  Link,
  Outlet,
  redirect,
  retainSearchParams,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useDefaultLayout } from "react-resizable-panels";

import { SiteHeader } from "#/routes/_components/site-header/site-header.tsx";
import { TOUR } from "#/shared/lib/tour.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { useExplorer } from "#/shared/ui/explorer/explorer.context.tsx";
import { Explorer } from "#/shared/ui/explorer/explorer.tsx";
import { NotePanel } from "#/shared/ui/explorer/note-panel.tsx";
import { TourCard } from "#/shared/ui/explorer/tour-card.tsx";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "#/shared/ui/resizable/resizable.tsx";
import { SourceView } from "#/shared/ui/source-view/source-view.tsx";
import { Tabs, TabsList, TabsTrigger } from "#/shared/ui/tabs/tabs.tsx";

const FILE = "src/routes/__root.tsx";

/**
 * The shell every URL renders inside: the file tree on the left, an <Outlet/>
 * on the right. A real root layout, which is why the tree keeps its scroll and
 * expansion state as you navigate.
 */
function RootLayout() {
  const { source } = Route.useSearch();
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({ id: "shell" });

  return (
    <div className="flex h-dvh flex-col bg-background">
      <SiteHeader />

      {/* Source on the left, the running app in the middle, and the note about
          whatever is outlined on the right — next to the thing it describes.
          The tree is resizable; its width is remembered per viewer. */}
      <ResizablePanelGroup
        orientation="horizontal"
        className="min-h-0 flex-1"
        defaultLayout={defaultLayout}
        onLayoutChanged={onLayoutChanged}
      >
        <ResizablePanel id="tree" defaultSize="19rem" minSize="14rem" maxSize="40%">
          <Explorer />
        </ResizablePanel>
        <ResizableHandle className="transition-colors hover:bg-ring" />
        <ResizablePanel id="app">
          <div className="grid h-full min-h-0 grid-cols-[minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_22rem]">
            <main className="flex min-h-0 flex-col gap-4 p-6">
              <TourCard />
              <Preview source={source} />
            </main>
            <div className="hidden min-h-0 xl:flex">
              <NotePanel />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function Preview({ source }: { source?: string }) {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { selectedPath } = useExplorer();

  function showSource(path: string | null) {
    navigate({
      to: ".",
      search: (previous: Record<string, unknown>) => ({ ...previous, source: path ?? undefined }),
    });
  }

  const query = new URLSearchParams(search as Record<string, string>).toString();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-background">
      <div className="flex h-12 shrink-0 items-center gap-4 border-b px-5">
        {/* The real address bar, not a drawing of one. */}
        <div className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
          {window.location.host}
          <span className="text-foreground">
            {pathname}
            {query && `?${query}`}
          </span>
        </div>
        <Tabs value={source ? "code" : "preview"}>
          <TabsList variant="line">
            <TabsTrigger onClick={() => showSource(null)} value="preview">
              Превью
            </TabsTrigger>
            <TabsTrigger onClick={() => showSource(selectedPath)} value="code">
              Код
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {source ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex h-10 shrink-0 items-center border-b px-5">
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
              {source}
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            <SourceView path={source} />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-10">
          <Boundary file={FILE} label="__root.tsx">
            <Outlet />
          </Boundary>
        </div>
      )}
    </div>
  );
}

/**
 * Reached by a URL nothing answers, and by a loader throwing notFound — try
 * /projects/apollo/tasks/TF-999, or the tempting /wizard/wizard.context.
 */
function NotFound() {
  return (
    <div className="max-w-prose space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">По этому адресу ничего нет</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Адресом становится только папка в <code>routes/</code> со страницей <code>*.page.tsx</code>.
        Папка с подчёркиванием исключена из роутинга, а файлы вроде <code>wizard.context.tsx</code> — не
        маршруты. Если адрес правильный, значит, лоадер не нашёл запись: неизвестный id превращается
        в эту страницу ещё до рендера.
      </p>
      <Link to="/projects" className="inline-block text-sm text-layer-routes hover:underline">
        Вернуться к /projects
      </Link>
    </div>
  );
}

/** What every loader receives: the query cache, handed down by app/router.tsx. */
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // A file being read is part of the address, so the view can be linked to —
  // the same rule the task filter follows.
  validateSearch: (search: Record<string, unknown>) => {
    const valid: { source?: string; tour?: number } = {};
    if (typeof search.source === "string") valid.source = search.source;
    if (typeof search.tour === "number" && TOUR[search.tour]) valid.tour = search.tour;
    return valid;
  },
  // The tour follows the reader through the app until they end it.
  search: { middlewares: [retainSearchParams(["tour"])] },
  // `/` has no page of its own — a root page would sit beside __root.tsx and
  // name nothing. The app starts at the project list.
  beforeLoad: ({ location }) => {
    if (location.pathname === "/") throw redirect({ to: "/projects" });
  },
  component: RootLayout,
  notFoundComponent: NotFound,
});
