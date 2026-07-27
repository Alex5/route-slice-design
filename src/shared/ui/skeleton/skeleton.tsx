import { cn } from "#/shared/lib/utils.ts";

/** Stand-in for content the example does not need to spell out. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("h-2.5 rounded-full bg-white/10", className)} />;
}
