import { useEffect, useState } from "react";

import { loadSource } from "#/shared/lib/source-code.ts";
import { Code } from "#/shared/ui/code/code.tsx";

/** Shows a file exactly as it is on disk. */
export function SourceView({ path }: { path: string }) {
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setCode(null);
    setError(null);

    loadSource(path)
      .then((text) => {
        if (!cancelled) setCode(text.trimEnd());
      })
      .catch((cause: Error) => {
        if (!cancelled) setError(cause.message);
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  if (error) return <div className="p-4 text-xs text-destructive">{error}</div>;
  if (!code) return <div className="p-4 text-xs text-muted-foreground">Reading {path}…</div>;

  return <Code code={code} path={path} className="numbered" />;
}
