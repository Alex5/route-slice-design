/**
 * Which source file the interface is pointing at.
 *
 * Two channels, deliberately kept apart:
 *
 * - `selectedPath` is persistent. It is derived from the URL, so navigating
 *   anywhere — a link in the app, a click in the tree, the back button — moves
 *   it, and no caller has to remember to keep it in step.
 * - `hoveredPath` is transient. It previews without disturbing the selection.
 *
 * Shared, because the tree in the root layout and every boundary in every route
 * both need it. It holds no route state of its own: navigation is the router's
 * job.
 */
import { useLocation, useMatches, useNavigate } from "@tanstack/react-router";
import { createContext, use, useEffect, useMemo, useState, type ReactNode } from "react";

import { ancestorIds, nodeByPath, pathForRouteId } from "#/shared/lib/source-tree.ts";

interface ExplorerValue {
  /** Persistent selection. Follows the URL unless a file was picked on it. */
  selectedPath: string | null;
  /** Transient preview under the cursor. */
  hoveredPath: string | null;
  /** What the note panel describes: the cursor if there is one, else the selection. */
  activePath: string | null;
  expanded: string[];
  setExpanded: (paths: string[]) => void;
  collapseAll: () => void;
  hover: (path: string | null) => void;
  select: (path: string | null) => void;
  /**
   * What clicking a file means, in one place: a file that renders a URL is
   * navigated to, and a file that renders nothing shows its code instead.
   */
  open: (path: string) => void;
}

const ExplorerContext = createContext<ExplorerValue | null>(null);

export function useExplorer() {
  const value = use(ExplorerContext);
  if (!value) throw new Error("useExplorer must be called inside <ExplorerProvider>");
  return value;
}

const INITIAL_EXPANDED = ["src", "src/routes", "src/routes/react/projects", "src/shared"];

export function ExplorerProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // The deepest match is the file actually rendering the page.
  const matches = useMatches();
  const routeId = matches.at(-1)?.routeId ?? null;
  const [hoveredPath, setHovered] = useState<string | null>(null);
  // The pick is remembered together with the URL it was made on, so navigating
  // away drops it instead of leaving a stale file selected.
  const [picked, setPicked] = useState<{ path: string; at: string } | null>(null);
  const [expanded, setExpanded] = useState<string[]>(INITIAL_EXPANDED);

  const routeFile = routeId ? pathForRouteId(routeId) : null;
  const selectedPath = picked?.at === pathname ? picked.path : routeFile;

  // Revealing is a consequence of the selection changing, not of the click that
  // changed it — which is what makes a link inside the app move the tree too.
  // Only ancestors are opened, so collapsing a folder by hand still sticks.
  useEffect(() => {
    if (!selectedPath) return;
    setExpanded((previous) => [...new Set([...previous, ...ancestorIds(selectedPath)])]);
  }, [selectedPath]);

  const value = useMemo<ExplorerValue>(
    () => ({
      selectedPath,
      hoveredPath,
      activePath: hoveredPath ?? selectedPath,
      expanded,
      setExpanded,
      collapseAll: () => setExpanded(["src"]),
      hover: setHovered,
      select: (path) => setPicked(path ? { path, at: pathname } : null),
      open: (path) => {
        setPicked({ path, at: pathname });

        const route = nodeByPath.get(path)?.route;

        if (route) {
          // The URL is derived from a path at runtime, so the typed navigation
          // API cannot check it. This is the one place that cast is unavoidable.
          navigate({ to: route as "/" });
          return;
        }

        navigate({
          to: ".",
          search: (previous: Record<string, unknown>) => ({ ...previous, source: path }),
        });
      },
    }),
    [pathname, navigate, selectedPath, hoveredPath, expanded],
  );

  return <ExplorerContext value={value}>{children}</ExplorerContext>;
}
