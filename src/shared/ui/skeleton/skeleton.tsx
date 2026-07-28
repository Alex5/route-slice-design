import type * as React from "react";

import { cn } from "#/shared/lib/utils.ts";

/**
 * shadcn's skeleton. Used here for content the example deliberately leaves out
 * rather than for loading, so call sites pass `animate-none` — a pulse would
 * claim the app is waiting on something when it is not.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-accent", className)}
      {...props}
    />
  );
}

export { Skeleton };
