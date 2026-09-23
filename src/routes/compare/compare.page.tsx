import { createFileRoute } from "@tanstack/react-router";

import editSource from "#/routes/projects/$projectId/tasks/$taskId/edit/edit.page.tsx?raw";
// The two twins are imported as text, not as modules: this page reads them the
// way a reader would, and takes on no dependency on what they render.
import addSource from "#/routes/projects/$projectId/tasks/new/new.page.tsx?raw";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { Code } from "#/shared/ui/code/code.tsx";

const FILE = "src/routes/compare/compare.page.tsx";
const ADD = "src/routes/projects/$projectId/tasks/new/new.page.tsx";
const EDIT = "src/routes/projects/$projectId/tasks/$taskId/edit/edit.page.tsx";

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

function meaningful(lines: string[]) {
  return lines.filter((line) => line.trim()).length;
}

const sharedCount = addShared.filter(Boolean).length + editShared.filter(Boolean).length;
const similarity = Math.round((sharedCount / (meaningful(addLines) + meaningful(editLines))) * 100);

function SourceColumn({
  file,
  label,
  source,
  shared,
}: {
  file: string;
  label: string;
  source: string;
  shared: boolean[];
}) {
  return (
    <Boundary file={file} label={label} className="min-w-0">
      <Code
        code={source}
        path={file}
        // Shiki counts lines from one; the marks are indexed from zero.
        isShared={(line) => shared[line - 1] ?? false}
        className="numbered !p-0"
      />
    </Boundary>
  );
}

function ComparePage() {
  return (
    <div className="space-y-10">
      <div className="max-w-2xl space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Эти два файла совпадают построчно на {similarity}%. Не трогайте их.
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Цифра измерена по настоящим исходникам, а не записана в комментарии, поэтому не может
          разойтись с кодом. Подсвечены строки, которые есть в обоих файлах. Блоки не принадлежат ни
          одной из страниц: всё без доменных знаний пришло из{" "}
          <span className="text-layer-shared">shared/ui</span>, а всё, что знает о задаче, поднято в{" "}
          <span className="text-layer-routes">tasks/-components</span> на втором использовании.
          Дублируется только сборка — заголовок, значения по умолчанию, какая запись выполняется и
          куда вы попадёте после. Слить это в одну страницу с пропом <code>mode</code> — значит
          протащить ветвление в каждый блок ниже.
        </p>
      </div>

      <Boundary file={FILE} label="compare.page.tsx">
        <div className="grid gap-6 lg:grid-cols-2">
          <SourceColumn
            file={ADD}
            label="new.page.tsx"
            source={addSource.trimEnd()}
            shared={addShared}
          />
          <SourceColumn
            file={EDIT}
            label="edit.page.tsx"
            source={editSource.trimEnd()}
            shared={editShared}
          />
        </div>
      </Boundary>
    </div>
  );
}

export const Route = createFileRoute("/compare/")({
  component: ComparePage,
});
