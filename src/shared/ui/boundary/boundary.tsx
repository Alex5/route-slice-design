/**
 * A dashed outline standing for one file's slice of the rendered output, with
 * that file named on the border.
 *
 * It takes a repository path and nothing else, so a boundary cannot disagree
 * with the tree on the left: both read the same filesystem.
 */
import type { ReactNode } from "react";

import { useExplorer } from "#/shared/explorer/explorer.context.tsx";
import { cn } from "#/shared/lib/utils.ts";
import { isBoundaryActive, nodeByPath, type Layer } from "#/shared/lib/source-tree.ts";

const STYLE: Record<Layer, { border: string; chip: string }> = {
  app: { border: "border-layer-app/80", chip: "bg-layer-app text-black" },
  routes: { border: "border-layer-routes/80", chip: "bg-layer-routes text-black" },
  shared: { border: "border-layer-shared/80", chip: "bg-layer-shared text-black" },
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
  const { activePath, hover, select } = useExplorer();

  const node = nodeByPath.get(file);
  const style = STYLE[node?.layer ?? "routes"];
  const active = isBoundaryActive(activePath, file);

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
        active ? style.border : "border-white/10",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => select(file)}
        className={cn(
          "absolute -top-2.5 start-4 whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[10px] uppercase leading-4 tracking-wider transition-colors",
          active ? style.chip : "bg-secondary text-muted-foreground hover:text-foreground",
        )}
      >
        {label ?? node?.name ?? file}
      </button>
      {children}
    </div>
  );
}
