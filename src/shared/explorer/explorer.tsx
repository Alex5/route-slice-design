import { FileTree } from "#/shared/explorer/file-tree.tsx";

const LEGEND = [
  { label: "app", className: "bg-layer-app", hint: "composition root" },
  { label: "routes", className: "bg-layer-routes", hint: "the route tree" },
  { label: "shared", className: "bg-layer-shared", hint: "everything route-agnostic" },
];

/** The left column: this application's own source, at full height. */
export function Explorer() {
  return (
    <aside className="flex min-h-0 flex-col border-e bg-card/40 col-span-3">
      <div className="flex shrink-0 items-center gap-3 px-4 py-2.5 text-[11px] text-muted-foreground">
        {LEGEND.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5" title={item.hint}>
            <span className={`size-2 rounded-full ${item.className}`} />
            {item.label}
          </span>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        <FileTree />
      </div>
    </aside>
  );
}
