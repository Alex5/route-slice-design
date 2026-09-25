/**
 * The file tree shown on the left is this repository, read at build time.
 *
 * Nothing here is hand-maintained: `import.meta.glob` hands Vite's module graph
 * over, so a file that exists is a file on screen, and a file that is renamed
 * moves in the tree by itself.
 */

export type Layer = "app" | "routes" | "shared";

export interface SourceNode {
  /** Repository-relative path, e.g. `src/routes/projects/projects.page.tsx`. */
  id: string;
  name: string;
  layer: Layer;
  /** The URL this file answers on, or a segment folder answers on through its page or layout. */
  route: string | null;
  children?: SourceNode[];
}

/** Parameter values used when turning a file path back into a real URL. */
const PARAMS: Record<string, string> = {
  $projectId: "apollo",
  $taskId: "TF-142",
};

const IGNORED = ["src/routeTree.gen.ts", "src/vite-env.d.ts"];

function layerOf(path: string): Layer {
  if (path.startsWith("src/routes/")) return "routes";
  if (path.startsWith("src/shared/")) return "shared";
  return "app";
}

/** A route file carries its role in the suffix (Т5); every other file is not a route. */
const ROUTE_FILE = /\.(page|layout)\.tsx$/;

/**
 * Derives the URL a route file answers on, mirroring the tree vite.config.ts
 * describes to the generator: a `*.page.tsx` or `*.layout.tsx` answers on its
 * folder, a `_`-prefixed folder is excluded from routing, and anything else —
 * `wizard.context.tsx`, `__root.tsx` — answers no URL of its own.
 */
export function routeForPath(path: string): string | null {
  if (!path.startsWith("src/routes/") || !ROUTE_FILE.test(path)) return null;

  const folders = path.slice("src/routes/".length).split("/").slice(0, -1);
  if (folders.some((segment) => segment.startsWith("_"))) return null;

  return `/${folders.map((segment) => PARAMS[segment] ?? segment).join("/")}`;
}

/**
 * The file that declares a given route, asked of the router rather than guessed
 * from the address.
 *
 * Matching a rendered URL against a derived one only ever worked for the
 * parameter values baked into `PARAMS` — `/tasks/TF-138` matched nothing. A
 * route id carries the pattern instead of a substitution, so every parameter
 * value lands on the same file, and a deployment base path cannot confuse it.
 * An id ending in a slash is the folder's page, any other is its layout.
 */
export function pathForRouteId(routeId: string): string | null {
  const dir = `src/routes${routeId.replace(/\/$/, "")}`;
  const role = routeId.endsWith("/") ? ".page.tsx" : ".layout.tsx";

  for (const path of nodeByPath.keys()) {
    if (
      path.startsWith(`${dir}/`) &&
      !path.slice(dir.length + 1).includes("/") &&
      path.endsWith(role)
    ) {
      return path;
    }
  }
  return null;
}

function insert(root: SourceNode[], path: string) {
  const segments = path.split("/");

  let level = root;
  let walked = "";

  segments.forEach((segment, index) => {
    walked = walked ? `${walked}/${segment}` : segment;
    const isFile = index === segments.length - 1;

    let node = level.find((candidate) => candidate.name === segment);

    if (!node) {
      node = {
        id: walked,
        name: segment,
        layer: layerOf(walked),
        route: routeForPath(walked),
        ...(isFile ? {} : { children: [] }),
      };
      level.push(node);
    }

    if (!isFile) level = node.children!;
  });
}

function sortTree(nodes: SourceNode[]): SourceNode[] {
  return nodes
    .sort((a, b) => {
      const aDir = Boolean(a.children);
      const bDir = Boolean(b.children);
      if (aDir !== bDir) return aDir ? -1 : 1;
      return a.name.localeCompare(b.name);
    })
    .map((node) => {
      if (!node.children) return node;
      const children = sortTree(node.children);
      // A segment folder answers on the URL of its page or layout (Т5), so
      // clicking the folder goes where clicking that file would.
      const route = children.find((child) => !child.children && child.route)?.route ?? null;
      return { ...node, children, route };
    });
}

// Vite leaves the file containing the glob out of its own results, so this
// module has to put itself back in.
const SELF = "src/shared/lib/source-tree.ts";

const files = [
  ...new Set([
    ...Object.keys(import.meta.glob("/src/**/*.{ts,tsx,css}")).map((key) => key.replace(/^\//, "")),
    SELF,
  ]),
].filter((path) => !IGNORED.includes(path));

const roots: SourceNode[] = [];
files.forEach((path) => insert(roots, path));

export const sourceTree: SourceNode[] = sortTree(roots);

/** Flat index by path. */
export const nodeByPath = new Map<string, SourceNode>();

(function index(nodes: SourceNode[]) {
  nodes.forEach((node) => {
    nodeByPath.set(node.id, node);
    if (node.children) index(node.children);
  });
})(sourceTree);

/** Every ancestor of a path — used to reveal a branch of the tree. */
export function ancestorIds(path: string): string[] {
  const parts = path.split("/");
  return parts.slice(0, -1).map((_, i) => parts.slice(0, i + 1).join("/"));
}

/** A boundary lights up for its own file and for any folder containing it. */
export function isBoundaryActive(activePath: string | null, filePath: string) {
  if (!activePath) return false;
  return activePath === filePath || filePath.startsWith(`${activePath}/`);
}

/** A tree row lights up for its own file and for anything nested inside it. */
export function isRowActive(activePath: string | null, nodePath: string) {
  if (!activePath) return false;
  return activePath === nodePath || activePath.startsWith(`${nodePath}/`);
}
