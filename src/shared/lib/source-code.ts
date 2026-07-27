/**
 * The text of every file, loaded on demand.
 *
 * Same trick as the tree: Vite's module graph is the source. `?raw` hands back
 * the file as a string, so what the preview shows is what is on disk.
 */
import self from "#/shared/lib/source-code.ts?raw";

const loaders = import.meta.glob("/src/**/*.{ts,tsx,css}", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

/** A glob never includes the file it is written in, so this one adds itself. */
const SELF = "src/shared/lib/source-code.ts";

export function hasSource(path: string) {
  return path === SELF || `/${path}` in loaders;
}

export async function loadSource(path: string): Promise<string> {
  if (path === SELF) return self;

  const loader = loaders[`/${path}`];
  if (!loader) throw new Error(`[source-code]: no source for ${path}`);

  return loader();
}
