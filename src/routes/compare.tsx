import { createFileRoute } from "@tanstack/react-router";

import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { cn } from "#/shared/lib/utils.ts";
// The two twins are imported as text, not as modules: this page reads them the
// way a reader would, and takes on no dependency on what they render.
import addSource from "#/routes/projects/$projectId/tasks/new/index.tsx?raw";
import editSource from "#/routes/projects/$projectId/tasks/$taskId/edit/index.tsx?raw";

const FILE = "src/routes/compare.tsx";
const ADD = "src/routes/projects/$projectId/tasks/new/index.tsx";
const EDIT = "src/routes/projects/$projectId/tasks/$taskId/edit/index.tsx";

/**
 * Marks the lines of `own` that also occur in `other`, consuming each match so
 * a line repeated twice on one side only counts twice if it repeats on both.
 */
function markShared(own: string[], other: string[]) {
  const pool = new Map<string, number>();

  other.forEach((line) => {
    const key = line.trim();
    if (key) pool.set(key, (pool.get(key) ?? 0) + 1);
  });

  return own.map((line) => {
    const key = line.trim();
    if (!key) return false;
    const left = pool.get(key) ?? 0;
    if (left === 0) return false;
    pool.set(key, left - 1);
    return true;
  });
}

const addLines = addSource.trimEnd().split("\n");
const editLines = editSource.trimEnd().split("\n");

const addShared = markShared(addLines, editLines);
const editShared = markShared(editLines, addLines);

const meaningful = (lines: string[]) => lines.filter((line) => line.trim()).length;
const sharedCount = addShared.filter(Boolean).length + editShared.filter(Boolean).length;
const similarity = Math.round(
  (sharedCount / (meaningful(addLines) + meaningful(editLines))) * 100,
);

function SourceColumn({
  file,
  label,
  lines,
  shared,
}: {
  file: string;
  label: string;
  lines: string[];
  shared: boolean[];
}) {
  return (
    <Boundary file={file} label={label} className="min-w-0">
      <pre className="overflow-x-auto text-[11px] leading-5">
        <code>
          {lines.map((line, index) => (
            <div
              // Line numbers are stable identity here; the file does not reorder.
              key={`${index}-${line}`}
              className={cn(
                "whitespace-pre px-2",
                shared[index] ? "bg-layer-shared/10 text-foreground" : "text-muted-foreground",
              )}
            >
              {line || " "}
            </div>
          ))}
        </code>
      </pre>
    </Boundary>
  );
}

function ComparePage() {
  return (
    <div className="space-y-6">
      <div className="max-w-3xl space-y-2">
        <div className="text-sm font-medium">
          These two files are {similarity}% the same line for line. Leave them alone.
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          That number is measured from the real source of both files, not asserted in a comment, so
          it cannot drift away from the code. Highlighted lines occur in both. Neither page owns the
          blocks it renders: anything domain-free comes from{" "}
          <span className="text-layer-shared">shared/ui</span>, anything that knows what a Task is
          was lifted to <span className="text-layer-routes">tasks/-components</span> on its second
          use. What stays duplicated is the assembly — heading, defaults, which write runs, where
          you land afterwards. Folding that into one page behind a <code>mode</code> prop would push
          a branch into every block underneath.
        </p>
      </div>

      <Boundary file={FILE} label="compare.tsx">
        <div className="grid gap-6 lg:grid-cols-2">
          <SourceColumn file={ADD} label="tasks/new/index.tsx" lines={addLines} shared={addShared} />
          <SourceColumn
            file={EDIT}
            label="$taskId/edit/index.tsx"
            lines={editLines}
            shared={editShared}
          />
        </div>
      </Boundary>
    </div>
  );
}

export const Route = createFileRoute("/compare")({
  component: ComparePage,
});
