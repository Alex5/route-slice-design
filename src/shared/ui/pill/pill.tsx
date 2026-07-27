import type { ReactNode } from "react";

import { cn } from "#/shared/lib/utils.ts";

export function Pill({
  children,
  active,
  onClick,
  className,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "rounded-md px-2.5 py-1 text-xs transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : onClick
            ? "bg-secondary text-secondary-foreground hover:bg-accent"
            : "bg-secondary/50 text-muted-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}
