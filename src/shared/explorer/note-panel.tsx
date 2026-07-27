import { useNavigate } from "@tanstack/react-router";
import { Code2, CornerDownRight, Lightbulb } from "lucide-react";

import { useExplorer } from "#/shared/explorer/explorer.context.tsx";
import { hasSource } from "#/shared/lib/source-code.ts";
import { sourceNotes } from "#/shared/lib/source-notes.ts";
import { nodeByPath, type Layer } from "#/shared/lib/source-tree.ts";
import { cn } from "#/shared/lib/utils.ts";
import { Badge } from "#/shared/ui/badge/badge.tsx";

const LAYER_BADGE: Record<Layer, string> = {
  app: "bg-layer-app/15 text-layer-app",
  routes: "bg-layer-routes/15 text-layer-routes",
  shared: "bg-layer-shared/15 text-layer-shared",
};

const LAYER_DOT: Record<Layer, string> = {
  app: "text-layer-app",
  routes: "text-layer-routes",
  shared: "text-layer-shared",
};

/**
 * Sits beside the preview and explains whatever is outlined in it.
 *
 * It follows `activePath` rather than the selection, so the outline on the left
 * of it and the words on the right of it are always about the same file.
 */
export function NotePanel() {
  const { activePath, select, hover } = useExplorer();
  const navigate = useNavigate();

  const node = activePath ? nodeByPath.get(activePath) : null;
  const note = activePath ? sourceNotes[activePath] : undefined;

  if (!node) {
    return (
      <aside className="flex-1 min-h-0 overflow-y-auto border-s bg-card/40 p-4 text-xs leading-relaxed text-muted-foreground">
        Hover a file to outline what it renders. Click it to go to its URL.
        <br />
        <br />
        Hover a box in the app to find the file behind it.
      </aside>
    );
  }

  return (
    <aside className="flex-1 min-h-0 space-y-3 overflow-y-auto border-s bg-card/40 p-4">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge className={cn("border-transparent", LAYER_BADGE[node.layer])}>{node.layer}</Badge>
        {note?.role && <Badge variant="outline">{note.role}</Badge>}
        {note?.rule && <Badge variant="secondary">{note.rule}</Badge>}
      </div>

      <div className="break-all font-mono text-[11px] leading-snug text-muted-foreground">
        {node.id}
      </div>

      {node.route && (
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-layer-routes">
          <CornerDownRight className="size-3" />
          {node.route}
        </div>
      )}

      {hasSource(node.id) && (
        <button
          type="button"
          onClick={() =>
            navigate({ to: ".", search: (previous) => ({ ...previous, source: node.id }) })
          }
          className="flex w-full items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs transition-colors hover:bg-accent"
        >
          <Code2 className="size-3.5" />
          Read the source
        </button>
      )}

      {note?.note && (
        <div className="flex gap-2 rounded-md border border-layer-app/30 bg-layer-app/10 px-2.5 py-2">
          <Lightbulb className="mt-px size-3.5 shrink-0 text-layer-app" />
          <span className="text-xs font-medium leading-relaxed">{note.note}</span>
        </div>
      )}

      {note?.doc && <p className="text-xs leading-relaxed">{note.doc}</p>}

      {note?.use && (
        <div className="space-y-1 border-s-2 border-border ps-2.5">
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Working on it
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{note.use}</p>
        </div>
      )}

      {note?.composedOf && (
        <div className="space-y-1">
          <div className="text-[11px] font-medium text-muted-foreground">Composed of</div>
          {note.composedOf.map((path) => {
            const block = nodeByPath.get(path);
            if (!block) return null;
            return (
              <button
                key={path}
                type="button"
                onClick={() => select(path)}
                onMouseEnter={() => hover(path)}
                onMouseLeave={() => hover(null)}
                className="flex w-full items-center gap-1.5 rounded px-1 py-0.5 text-start text-[11px] transition-colors hover:bg-accent"
              >
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full bg-current",
                    LAYER_DOT[block.layer],
                  )}
                />
                <span className="truncate font-mono text-muted-foreground">{block.name}</span>
                <span className="ms-auto shrink-0 text-[10px] text-muted-foreground/70">
                  {block.layer}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {!note && (
        <p className="text-xs leading-relaxed text-muted-foreground">No note for this file yet.</p>
      )}
    </aside>
  );
}
