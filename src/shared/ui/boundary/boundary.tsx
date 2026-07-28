/**
 * A dashed outline standing for one file's slice of the rendered output, with
 * that file named on the border.
 *
 * It takes a repository path and nothing else, so a boundary cannot disagree
 * with the tree on the left: both read the same filesystem.
 */
import type { ReactNode } from "react";

import { useExplorer } from "#/shared/ui/explorer/explorer.context.tsx";
import { isBoundaryActive, nodeByPath, type Layer } from "#/shared/lib/source-tree.ts";
import { cn } from "#/shared/lib/utils.ts";

/**
 * Two weights, never in competition: a selection stays lit while the cursor
 * roams, and a hover only previews.
 */
const STYLE: Record<Layer, { selected: string; hovered: string; chip: string; tint: string }> = {
  app: {
    selected: "border-layer-app/80",
    hovered: "border-layer-app/35",
    chip: "bg-layer-app text-black",
    tint: "bg-layer-app/20 text-layer-app",
  },
  routes: {
    selected: "border-layer-routes/80",
    hovered: "border-layer-routes/35",
    chip: "bg-layer-routes text-black",
    tint: "bg-layer-routes/20 text-layer-routes",
  },
  shared: {
    selected: "border-layer-shared/80",
    hovered: "border-layer-shared/35",
    chip: "bg-layer-shared text-black",
    tint: "bg-layer-shared/20 text-layer-shared",
  },
};

export function Boundary({
  file,
  label,
  className,
  children,
}: {
  /** Repository-relative path of the file rendering this box. */
  file: string;
  /** Shown on the border. Defaults to the file name. */
  label?: string;
  className?: string;
  children?: ReactNode;
}) {
  const { selectedPath, hoveredPath, hover, open } = useExplorer();

  const node = nodeByPath.get(file);
  const style = STYLE[node?.layer ?? "routes"];
  const selected = isBoundaryActive(selectedPath, file);
  const hovered = isBoundaryActive(hoveredPath, file);

  return (
    <div
      // mouseover bubbles: the innermost boundary stops it and wins, so nested
      // outlines never fight over the cursor.
      onMouseOver={(event) => {
        event.stopPropagation();
        hover(file);
      }}
      onMouseOut={() => hover(null)}
      className={cn(
        "relative rounded-lg border border-dashed px-5 pb-5 pt-7 transition-colors",
        selected ? style.selected : hovered ? style.hovered : "border-white/10",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => open(file)}
        className={cn(
          "absolute -top-2.5 start-4 whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[10px] uppercase leading-4 tracking-wider transition-colors",
          selected
            ? style.chip
            : hovered
              ? style.tint
              : "bg-secondary text-muted-foreground hover:text-foreground",
        )}
      >
        {label ?? node?.name ?? file}
      </button>
      {children}
    </div>
  );
}
