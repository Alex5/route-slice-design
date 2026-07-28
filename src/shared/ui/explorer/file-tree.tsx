import { FileCode2, FileText, Folder, FolderOpen } from "lucide-react";
import { useEffect } from "react";

import { useExplorer } from "#/shared/ui/explorer/explorer.context.tsx";
import { isRowActive, sourceTree, type Layer, type SourceNode } from "#/shared/lib/source-tree.ts";
import { cn } from "#/shared/lib/utils.ts";
import {
  createTreeCollection,
  TreeViewBranch,
  TreeViewBranchContent,
  TreeViewBranchControl,
  TreeViewBranchIndentGuide,
  TreeViewBranchIndicator,
  TreeViewBranchText,
  TreeViewItem,
  TreeViewItemText,
  TreeViewNodeProvider,
  TreeViewRoot,
  TreeViewTree,
} from "#/shared/ui/tree-view/tree-view.tsx";

const collection = createTreeCollection<SourceNode>({
  nodeToValue: (node) => node.id,
  nodeToString: (node) => node.name,
  rootNode: { id: "root", name: "", layer: "app", route: null, children: sourceTree },
});

const LAYER_TEXT: Record<Layer, string> = {
  app: "text-layer-app",
  routes: "text-layer-routes",
  shared: "text-layer-shared",
};

function NodeIcon({ node, expanded }: { node: SourceNode; expanded: boolean }) {
  const color = LAYER_TEXT[node.layer];

  if (node.children) {
    const Icon = expanded ? FolderOpen : Folder;
    return <Icon className={cn("size-3.5 shrink-0", color)} />;
  }

  const Icon = node.name.endsWith(".tsx") ? FileCode2 : FileText;
  return <Icon className={cn("size-3.5 shrink-0 opacity-70", color)} />;
}

function TreeNode({ node, indexPath }: { node: SourceNode; indexPath: number[] }) {
  const { expanded, hoveredPath, open, hover } = useExplorer();

  const isExpanded = expanded.includes(node.id);
  // Ark paints the selected row from selectedValue; this is the lighter weight
  // for whatever the cursor is on, including a boundary over in the preview.
  const isHovered = isRowActive(hoveredPath, node.id);

  const rowProps = {
    onClick: () => open(node.id),
    onMouseEnter: () => hover(node.id),
    onMouseLeave: () => hover(null),
    className: cn(isHovered && "bg-accent/40"),
  };

  if (node.children) {
    return (
      <TreeViewNodeProvider node={node} indexPath={indexPath}>
        <TreeViewBranch>
          <TreeViewBranchControl {...rowProps}>
            <TreeViewBranchIndicator />
            <NodeIcon node={node} expanded={isExpanded} />
            <TreeViewBranchText>{node.name}</TreeViewBranchText>
          </TreeViewBranchControl>
          <TreeViewBranchContent>
            <TreeViewBranchIndentGuide />
            {node.children.map((child, index) => (
              <TreeNode key={child.id} node={child} indexPath={[...indexPath, index]} />
            ))}
          </TreeViewBranchContent>
        </TreeViewBranch>
      </TreeViewNodeProvider>
    );
  }

  return (
    <TreeViewNodeProvider node={node} indexPath={indexPath}>
      <TreeViewItem {...rowProps}>
        <span className="size-4 shrink-0" />
        <NodeIcon node={node} expanded={false} />
        {/* The filename never shrinks; the URL badge gives way instead. */}
        <TreeViewItemText className="shrink-0">{node.name}</TreeViewItemText>
        {node.route && (
          <span className="ms-auto min-w-0 truncate ps-2 font-mono text-[10px] text-muted-foreground">
            {node.route}
          </span>
        )}
      </TreeViewItem>
    </TreeViewNodeProvider>
  );
}

export function FileTree() {
  const { expanded, setExpanded, selectedPath } = useExplorer();

  // Navigating can select a file that is scrolled out of view.
  useEffect(() => {
    if (!selectedPath) return;
    document
      .querySelector(`[data-value="${CSS.escape(selectedPath)}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selectedPath]);

  return (
    <TreeViewRoot
      collection={collection}
      selectionMode="single"
      expandedValue={expanded}
      onExpandedChange={(details) => setExpanded(details.expandedValue)}
      selectedValue={selectedPath ? [selectedPath] : []}
      className="text-sm"
      aria-label="Source files of this application"
    >
      <TreeViewTree className="space-y-px">
        {sourceTree.map((node, index) => (
          <TreeNode key={node.id} node={node} indexPath={[index]} />
        ))}
      </TreeViewTree>
    </TreeViewRoot>
  );
}
