/**
 * The file tree shown on the left is this repository, read at build time.
 *
 * Nothing here is hand-maintained: `import.meta.glob` hands Vite's module graph
 * over, so a file that exists is a file on screen, and a file that is renamed
 * moves in the tree by itself.
 */

export type Layer = "app" | "routes" | "shared";

export interface SourceNode {
  /** Repository-relative path, e.g. `src/routes/react/projects/index.tsx`. */
  id: string;
  name: string;
  layer: Layer;
  /** The URL this file is reachable at, when it is a route file. */
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

/**
 * Derives the URL a route file answers on, mirroring the rules the generator
 * itself applies:
 *
 * - `-`-prefixed folders are excluded from routing;
 * - `__root` is the shell and answers no URL of its own;
 * - `index` and `route` drop out of the path;
 * - a role file keeps its role in a dot suffix (`board.store.ts`,
 *   `wizard.context.tsx`), and a dotted name is not a route.
 *
 * The last rule is the one worth stating out loud: without it this function
 * would advertise `/board/board.store`, a URL the router has never heard of.
 */
export function routeForPath(path: string): string | null {
  if (!path.startsWith("src/routes/")) return null;

  const relative = path.slice("src/routes/".length);
  const segments = relative.replace(/\.tsx?$/, "").split("/");
  const name = segments.at(-1) ?? "";

  if (segments.some((segment) => segment.startsWith("-"))) return null;
  if (name === "__root") return null;
  if (name.includes(".")) return null;
  if (name === "index" || name === "route") segments.pop();

  const url = `/${segments.map((segment) => PARAMS[segment] ?? segment).join("/")}`;
  return url === "/" ? "/" : url.replace(/\/$/, "");
}

/**
 * The file that declares a given route, asked of the router rather than guessed
 * from the address.
 *
 * Matching a rendered URL against a derived one only ever worked for the
 * parameter values baked into `PARAMS` — `/tasks/TF-138` matched nothing. A
 * route id carries the pattern instead of a substitution, so every parameter
 * value lands on the same file, and a deployment base path cannot confuse it.
 */
export function pathForRouteId(routeId: string): string | null {
  const base = `src/routes${routeId}`;

  const candidates = routeId.endsWith("/")
    ? [`${base}index.tsx`]
    : [`${base}/route.tsx`, `${base}.tsx`];

  return candidates.find((candidate) => nodeByPath.has(candidate)) ?? null;
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
    .map((node) => (node.children ? { ...node, children: sortTree(node.children) } : node));
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
