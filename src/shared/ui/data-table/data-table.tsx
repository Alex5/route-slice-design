import type { ReactNode } from "react";

import { cn } from "#/shared/lib/utils.ts";

/**
 * Generic over the row type and ignorant of Task and Project, which is
 * precisely why it is allowed to live in shared.
 */
export function DataTable<Row>({
  rows,
  getKey,
  renderRow,
  onOpen,
  empty = "Nothing here",
}: {
  rows: Row[];
  getKey: (row: Row) => string;
  renderRow: (row: Row) => ReactNode;
  onOpen?: (row: Row) => void;
  empty?: string;
}) {
  if (rows.length === 0) {
    return <div className="px-2 py-6 text-center text-xs text-muted-foreground">{empty}</div>;
  }

  return (
    <div className="space-y-1">
      {rows.map((row) => (
        <button
          key={getKey(row)}
          type="button"
          onClick={() => onOpen?.(row)}
          disabled={!onOpen}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-2 py-2 text-start text-xs transition-colors",
            onOpen ? "hover:bg-white/5" : "cursor-default",
          )}
        >
          {renderRow(row)}
        </button>
      ))}
    </div>
  );
}
