import { createFileRoute } from "@tanstack/react-router";

import { BoardColumn } from "#/routes/board/-components/board-column/board-column.tsx";
import { COLUMNS, useBoardStore } from "#/routes/board/board.store.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { Pill } from "#/shared/ui/pill/pill.tsx";

const FILE = "src/routes/board/index.tsx";

function BoardPage() {
  const reset = useBoardStore((state) => state.reset);

  return (
    <Boundary file={FILE} label="board/index.tsx" className="@container space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Board</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            State that belongs to neither the server nor the URL, kept in a store beside the route.
          </p>
        </div>
        <Pill onClick={reset}>Reset</Pill>
      </div>

      {/* The pane, not the viewport, decides how many columns fit. */}
      <div className="grid gap-5 @2xl:grid-cols-3">
        {COLUMNS.map((column) => (
          <BoardColumn key={column.id} column={column.id} title={column.title} />
        ))}
      </div>
    </Boundary>
  );
}

export const Route = createFileRoute("/board/")({
  component: BoardPage,
});
