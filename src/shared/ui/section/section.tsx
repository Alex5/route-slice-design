import type { ReactNode } from "react";

/**
 * Heading plus bordered body. Both task pages compose it and it has no idea
 * either of them exists — which is what earns it a place in shared/ui.
 */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4 rounded-lg border border-white/10 p-4">
      <div className="text-xs font-medium text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}
