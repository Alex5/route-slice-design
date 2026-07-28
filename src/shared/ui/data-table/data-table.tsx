import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/shared/ui/table/table.tsx";

export interface Column<Row> {
  key: string;
  header: string;
  cell: (row: Row) => ReactNode;
  className?: string;
}

/**
 * Generic over the row type and ignorant of Task and Project, which is
 * precisely why it is allowed to live in shared. It is a thin arrangement of
 * shadcn's table primitives — the columns come from the caller.
 */
export function DataTable<Row>({
  rows,
  columns,
  getKey,
  onOpen,
  empty = "Nothing here",
}: {
  rows: Row[];
  columns: Column<Row>[];
  getKey: (row: Row) => string;
  onOpen?: (row: Row) => void;
  empty?: string;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {columns.map((column) => (
            <TableHead key={column.key} className={column.className}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={columns.length}
              className="py-6 text-center text-muted-foreground"
            >
              {empty}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow
              key={getKey(row)}
              onClick={() => onOpen?.(row)}
              className={onOpen ? "cursor-pointer" : undefined}
            >
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
