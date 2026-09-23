import { useNavigate } from "@tanstack/react-router";
import { Code2, CornerDownRight, Lightbulb } from "lucide-react";

import { hasSource } from "#/shared/lib/source-code.ts";
import { sourceNotes } from "#/shared/lib/source-notes.ts";
import { nodeByPath, type Layer } from "#/shared/lib/source-tree.ts";
import { cn } from "#/shared/lib/utils.ts";
import { Badge } from "#/shared/ui/badge/badge.tsx";
import { useExplorer } from "#/shared/ui/explorer/explorer.context.tsx";

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
      <aside className="flex-1 min-h-0 space-y-3 overflow-y-auto border-s p-6 text-sm leading-relaxed text-muted-foreground">
        <p>Наведите на файл — подсветится то, что он рендерит. Кликните — откроется его URL.</p>
        <p>Наведите на рамку в приложении — найдёте файл за ней.</p>
      </aside>
    );
  }

  return (
    <aside className="flex-1 min-h-0 space-y-6 overflow-y-auto border-s p-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge className={cn("border-transparent", LAYER_BADGE[node.layer])}>{node.layer}</Badge>
          {note?.role && <Badge variant="outline">{note.role}</Badge>}
          {note?.rule && <Badge variant="secondary">{note.rule}</Badge>}
        </div>

        <div className="break-all font-mono text-xs leading-snug text-muted-foreground">
          {node.id}
        </div>

        {node.route && (
          <div className="flex items-center gap-1.5 font-mono text-xs text-layer-routes">
            <CornerDownRight className="size-3" />
            {node.route}
          </div>
        )}
      </div>

      {note?.note && (
        <div className="flex gap-2.5 rounded-lg bg-layer-app/10 px-3.5 py-3">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-layer-app" />
          <span className="text-sm font-medium leading-relaxed">{note.note}</span>
        </div>
      )}

      {note?.doc && <p className="text-sm leading-relaxed">{note.doc}</p>}

      {note?.use && (
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-muted-foreground">Как с этим работать</div>
          <p className="text-sm leading-relaxed text-muted-foreground">{note.use}</p>
        </div>
      )}

      {note?.composedOf && (
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-muted-foreground">Из чего собран</div>
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
                className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-start text-xs transition-colors hover:bg-accent"
              >
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full bg-current",
                    LAYER_DOT[block.layer],
                  )}
                />
                <span className="truncate font-mono text-muted-foreground">{block.name}</span>
                <span className="ms-auto shrink-0 text-muted-foreground/70">{block.layer}</span>
              </button>
            );
          })}
        </div>
      )}

      {!note && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          Для этого файла заметки пока нет.
        </p>
      )}

      {hasSource(node.id) && (
        <button
          type="button"
          onClick={() =>
            navigate({ to: ".", search: (previous) => ({ ...previous, source: node.id }) })
          }
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Code2 className="size-4" />
          Открыть исходник
        </button>
      )}
    </aside>
  );
}
