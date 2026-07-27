/**
 * Syntax highlighting for the source shown in the app.
 *
 * Shiki's fine-grained bundle: only the grammars this repository actually
 * contains are loaded, and only on first use. The JavaScript regex engine is
 * used instead of the Oniguruma wasm — smaller, and enough for these grammars.
 */
import type { HighlighterCore } from "shiki/core";

const THEME = "vitesse-dark";

type Lang = "tsx" | "css";

function langForPath(path: string): Lang {
  return path.endsWith(".css") ? "css" : "tsx";
}

let pending: Promise<HighlighterCore> | null = null;

function highlighter() {
  // Shiki itself is imported dynamically as well: reading source is a side
  // errand, and none of this belongs in the bundle that renders the app.
  pending ??= (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
      import("shiki/core"),
      import("shiki/engine/javascript"),
    ]);

    return createHighlighterCore({
      themes: [import("shiki/themes/vitesse-dark.mjs")],
      langs: [import("shiki/langs/tsx.mjs"), import("shiki/langs/css.mjs")],
      engine: createJavaScriptRegexEngine(),
    });
  })();

  return pending;
}

export interface HighlightOptions {
  /** Marks a 1-based line as shared, used by the twin comparison. */
  isShared?: (line: number) => boolean;
}

/**
 * Returns highlighted HTML. The input is this repository's own source read at
 * build time, never anything a visitor supplies.
 */
export async function highlight(
  code: string,
  path: string,
  options: HighlightOptions = {},
): Promise<string> {
  const shiki = await highlighter();

  return shiki.codeToHtml(code, {
    lang: langForPath(path),
    theme: THEME,
    transformers: [
      {
        line(node, line) {
          if (options.isShared?.(line)) {
            this.addClassToHast(node, "is-shared");
          }
        },
      },
    ],
  });
}
