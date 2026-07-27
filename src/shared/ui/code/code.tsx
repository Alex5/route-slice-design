import { useEffect, useState } from "react";

import { highlight } from "#/shared/lib/highlight.ts";
import { cn } from "#/shared/lib/utils.ts";

/**
 * Renders source with highlighting, falling back to plain text while the
 * grammar loads or if it fails. The markup comes from Shiki over this
 * repository's own files — never from anything a visitor provides.
 */
export function Code({
  code,
  path,
  isShared,
  className,
}: {
  code: string;
  /** Only used to pick a grammar. */
  path: string;
  /** Marks a 1-based line as shared, for the twin comparison. */
  isShared?: (line: number) => boolean;
  className?: string;
}) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setHtml(null);
    highlight(code, path, { isShared })
      .then((result) => {
        if (!cancelled) setHtml(result);
      })
      .catch(() => {
        // Plain text is a perfectly good fallback; colour is not the point.
      });

    return () => {
      cancelled = true;
    };
  }, [code, path, isShared]);

  if (!html) {
    return (
      <pre className={cn("overflow-x-auto p-4 text-[11px] leading-5", className)}>
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div
      className={cn("code-block overflow-x-auto p-4 text-[11px] leading-5", className)}
      // Shiki output over our own source files.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
