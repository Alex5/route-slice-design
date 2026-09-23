import { ChevronsDownUp } from "lucide-react";

import { useExplorer } from "#/shared/ui/explorer/explorer.context.tsx";
import { FileTree } from "#/shared/ui/explorer/file-tree.tsx";

const LEGEND = [
  { label: "app", className: "bg-layer-app", hint: "корень композиции" },
  { label: "routes", className: "bg-layer-routes", hint: "дерево маршрутов" },
  { label: "shared", className: "bg-layer-shared", hint: "всё, что не принадлежит маршруту" },
];

/** The left column: this application's own source, at full height. */
export function Explorer() {
  const { collapseAll } = useExplorer();

  return (
    <aside className="flex h-full min-h-0 flex-col">
      <div className="flex h-12 shrink-0 items-center gap-4 px-5 text-xs text-muted-foreground">
        {LEGEND.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5" title={item.hint}>
            <span className={`size-2 rounded-full ${item.className}`} />
            {item.label}
          </span>
        ))}
        <button
          type="button"
          onClick={collapseAll}
          title="Свернуть всё"
          aria-label="Свернуть всё"
          className="ms-auto rounded p-1 transition-colors hover:bg-accent hover:text-foreground"
        >
          <ChevronsDownUp className="size-3.5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-6">
        <FileTree />
      </div>
    </aside>
  );
}
