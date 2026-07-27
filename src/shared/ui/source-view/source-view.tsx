import { useEffect, useState } from "react";

import { loadSource } from "#/shared/lib/source-code.ts";

/**
 * Shows a file exactly as it is on disk. Line numbers are the identity here —
 * the file is not reordered, so an index is a stable key.
 */
export function SourceView({ path }: { path: string }) {
  const [lines, setLines] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLines(null);
    setError(null);

    loadSource(path)
      .then((text) => {
        if (!cancelled) setLines(text.trimEnd().split("\n"));
      })
      .catch((cause: Error) => {
        if (!cancelled) setError(cause.message);
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  if (error) {
    return <div className="p-4 text-xs text-destructive">{error}</div>;
  }

  if (!lines) {
    return <div className="p-4 text-xs text-muted-foreground">Reading {path}…</div>;
  }

  return (
    <pre className="overflow-x-auto p-4 text-[11px] leading-5">
      <code>
        {lines.map((line, index) => (
          <div key={`${index}-${line}`} className="flex whitespace-pre">
            <span className="w-8 shrink-0 select-none pe-3 text-end text-muted-foreground/40">
              {index + 1}
            </span>
            <span>{line || " "}</span>
          </div>
        ))}
      </code>
    </pre>
  );
}
