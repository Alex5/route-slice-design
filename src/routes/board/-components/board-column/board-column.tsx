import { ChevronLeft, ChevronRight } from "lucide-react";

import { useBoardStore, type Column } from "#/routes/board/board.store.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";

const FILE = "src/routes/board/-components/board-column/board-column.tsx";

/**
 * Subscribes to its own slice of the store instead of taking cards through
 * props. Because the store groups cards by column, an untouched column keeps
 * the same array reference and does not re-render when a card moves elsewhere.
 */
export function BoardColumn({ column, title }: { column: Column; title: string }) {
  const cards = useBoardStore((state) => state.cards[column]);
  const move = useBoardStore((state) => state.move);

  return (
    <Boundary file={FILE} label="-components/board-column" className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium">{title}</span>
        <span className="font-mono text-[10px] text-muted-foreground">{cards.length}</span>
      </div>

      <div className="space-y-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex items-center gap-2 rounded-md border border-white/10 px-2.5 py-2 text-xs"
          >
            <span className="min-w-0 flex-1 truncate">{card.title}</span>
            <button
              type="button"
              aria-label={`Move ${card.title} left`}
              onClick={() => move(card.id, -1)}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label={`Move ${card.title} right`}
              onClick={() => move(card.id, 1)}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        ))}
        {cards.length === 0 && (
          <div className="rounded-md border border-dashed border-white/10 px-2.5 py-3 text-center text-[11px] text-muted-foreground">
            Empty
          </div>
        )}
      </div>
    </Boundary>
  );
}
