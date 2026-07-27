/**
 * Which source file the interface is currently pointing at.
 *
 * Shared, because both the tree in the root layout and every boundary in every
 * route need it. It holds no route state of its own: navigation is the router's
 * job, and the selected file is derived from the URL.
 */
import { useLocation } from "@tanstack/react-router";
import { createContext, use, useMemo, useState, type ReactNode } from "react";

import { ancestorIds, pathForRoute } from "#/shared/lib/source-tree.ts";

interface ExplorerValue {
  /** File under the cursor, or the file rendering the current URL. */
  activePath: string | null;
  /** File whose details are shown. Follows the URL unless one is picked. */
  selectedPath: string | null;
  expanded: string[];
  setExpanded: (paths: string[]) => void;
  hover: (path: string | null) => void;
  select: (path: string | null) => void;
}

const ExplorerContext = createContext<ExplorerValue | null>(null);

export function useExplorer() {
  const value = use(ExplorerContext);
  if (!value) throw new Error("useExplorer must be called inside <ExplorerProvider>");
  return value;
}

const INITIAL_EXPANDED = ["src", "src/routes", "src/routes/projects", "src/shared"];

export function ExplorerProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [hovered, setHovered] = useState<string | null>(null);
  // The pick is remembered together with the URL it was made on, so navigating
  // away drops it instead of leaving a stale file in the details panel.
  const [picked, setPicked] = useState<{ path: string; at: string } | null>(null);
  const [expanded, setExpanded] = useState<string[]>(INITIAL_EXPANDED);

  const value = useMemo<ExplorerValue>(() => {
    // No live pick means "whatever file answers the current URL", so simply
    // navigating keeps the panel and the tree in step.
    const selectedPath = picked?.at === pathname ? picked.path : pathForRoute(pathname);

    return {
      activePath: hovered ?? selectedPath,
      selectedPath,
      expanded,
      setExpanded,
      hover: setHovered,
      select: (path) => {
        setPicked(path ? { path, at: pathname } : null);
        if (path) {
          // Only ancestors are revealed: leaving the node itself alone is what
          // lets a click on a folder collapse it instead of reopening it.
          setExpanded((prev) => [...new Set([...prev, ...ancestorIds(path)])]);
        }
      },
    };
  }, [pathname, hovered, picked, expanded]);

  return <ExplorerContext value={value}>{children}</ExplorerContext>;
}
