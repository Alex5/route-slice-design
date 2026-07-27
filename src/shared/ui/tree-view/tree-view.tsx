/**
 * A shadcn/ui-flavoured TreeView.
 *
 * shadcn ships no tree view, so this takes the headless primitives from Ark UI
 * and dresses them in the same tokens (bg-accent, text-muted-foreground,
 * ring-ring) as every other component. It sits in components/ui next to
 * button.tsx, exactly like anything added through the CLI.
 */
import { TreeView as Ark } from "@ark-ui/react";
import { ChevronRight } from "lucide-react";
import type * as React from "react";

import { cn } from "#/shared/lib/utils.ts";

export { createTreeCollection } from "@ark-ui/react";
export type { TreeCollection } from "@ark-ui/react";

/** Level indent: Ark exposes depth through the --depth CSS variable. */
const INDENT = "ps-[calc(var(--depth,1)*0.75rem)]";

export const TreeViewRoot = Ark.Root;
export const TreeViewTree = Ark.Tree;
export const TreeViewNodeProvider = Ark.NodeProvider;
export const TreeViewBranch = Ark.Branch;

export function TreeViewLabel({ className, ...props }: React.ComponentProps<typeof Ark.Label>) {
  return (
    <Ark.Label
      className={cn("px-2 pb-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}

const nodeRowClass =
  "group relative flex h-7 cursor-pointer select-none items-center gap-1.5 rounded-md pe-2 text-sm outline-none transition-colors hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring data-[selected]:bg-accent data-[selected]:text-accent-foreground";

export function TreeViewBranchControl({
  className,
  ...props
}: React.ComponentProps<typeof Ark.BranchControl>) {
  return <Ark.BranchControl className={cn(nodeRowClass, INDENT, className)} {...props} />;
}

export function TreeViewItem({ className, ...props }: React.ComponentProps<typeof Ark.Item>) {
  return <Ark.Item className={cn(nodeRowClass, INDENT, className)} {...props} />;
}

export function TreeViewBranchIndicator({
  className,
  ...props
}: React.ComponentProps<typeof Ark.BranchIndicator>) {
  return (
    <Ark.BranchIndicator
      className={cn(
        "flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-transform duration-150 data-[state=open]:rotate-90",
        className,
      )}
      {...props}
    >
      <ChevronRight className="size-3.5" />
    </Ark.BranchIndicator>
  );
}

export function TreeViewBranchText({
  className,
  ...props
}: React.ComponentProps<typeof Ark.BranchText>) {
  return <Ark.BranchText className={cn("truncate", className)} {...props} />;
}

export function TreeViewItemText({
  className,
  ...props
}: React.ComponentProps<typeof Ark.ItemText>) {
  return <Ark.ItemText className={cn("truncate", className)} {...props} />;
}

export function TreeViewBranchContent({
  className,
  ...props
}: React.ComponentProps<typeof Ark.BranchContent>) {
  return <Ark.BranchContent className={cn("relative", className)} {...props} />;
}

export function TreeViewBranchIndentGuide({
  className,
  ...props
}: React.ComponentProps<typeof Ark.BranchIndentGuide>) {
  return (
    <Ark.BranchIndentGuide
      className={cn(
        "absolute inset-y-0 border-s border-border/70",
        "ms-[calc(var(--depth,1)*0.75rem+0.4rem)]",
        className,
      )}
      {...props}
    />
  );
}
