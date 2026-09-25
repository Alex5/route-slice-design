// Проверяет жёсткие правила архитектуры из README:
//
// Т2. Слои: app → routes → shared, зависимости только вниз.
// Т3. Ветки маршрутов изолированы: из routes/ можно импортировать только код
//     своих предков — их _components/, _hooks/, _utils/ и role-файлы.
//     Соседняя ветка и сегменты ниже по дереву — никогда. Файл маршрута не
//     импортирует никто: к маршруту обращаются через getRouteApi.
// Т5. Файлы сегмента называются по нему: projects.page.tsx,
//     project-id.layout.tsx, tasks.loader.ts, wizard.context.tsx. index.tsx и
//     route.tsx запрещены. В каждой папке-сегменте есть *.page.tsx или
//     *.layout.tsx. Папки не-маршруты начинаются с _ и их три: _components/,
//     _hooks/, _utils/.
// Т9. Запросы — только в shared/api: в routes/ нет useQuery, useSuspenseQuery,
//     queryOptions, queryKey и fetch — страница вызывает хук из shared/api/hooks.
//
// Импорт с `?raw` — это чтение текста, а не зависимость от модуля, он не
// проверяется (так /compare читает двух близнецов).
//
// Запуск: node scripts/check-architecture.mjs — код выхода 1, если есть нарушения.
import { readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, normalize, relative } from "node:path";

const IMPORT = /(?:from|import)\s*\(?\s*["']([^"']+)["']/g;
const ROUTE_FILE = /\.(page|layout)\.tsx$/;
/** Что может лежать прямо в папке-сегменте: <сегмент>.<роль>.ts(x). */
/** То, чему место в shared/api/hooks, а не в маршрутах (Т9). */
const QUERY_CODE = /\b(useQuery|useSuspenseQuery|queryOptions|queryKey|fetch)\s*[(:]/;

const SEGMENT_ROLES = ["page", "layout", "loader", "context", "store"];
/** Папки не-маршруты внутри сегмента (Т5). */
const HIDDEN_FOLDERS = ["_components", "_hooks", "_utils"];

function layerOf(path) {
  if (path.startsWith("src/routes/")) return "routes";
  if (path.startsWith("src/shared/")) return "shared";
  return "app";
}

/** Кто может импортировать слой: app — всех, routes — routes и shared, shared — только себя. */
const ALLOWED = { app: ["app", "routes", "shared"], routes: ["routes", "shared"], shared: ["shared"] };

/**
 * Владелец файла — папка, в чьё поддерево он входит: путь до первого сегмента
 * с подчёркиванием (`_components`) или просто папка файла.
 */
function ownerOf(path) {
  const segments = dirname(path).split("/");
  const hidden = segments.findIndex((segment) => segment.startsWith("_"));
  return (hidden === -1 ? segments : segments.slice(0, hidden)).join("/");
}

/** `$projectId` → `project-id`: имя, которое должен носить файл маршрута сегмента. */
function kebab(segment) {
  return segment.replace(/^\$/, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function resolve(from, specifier) {
  if (specifier.startsWith("#/")) return join("src", specifier.slice(2));
  if (specifier.startsWith(".")) return normalize(join(dirname(from), specifier));
  return null; // внешний пакет
}

function importProblem(from, specifier) {
  if (specifier.includes("?raw")) return null;

  const target = resolve(from, specifier.split("?")[0]);
  if (!target) return null;
  if (!target.startsWith("src/")) return "код приложения живёт только в src/";

  const [a, b] = [layerOf(from), layerOf(target)];
  if (!ALLOWED[a].includes(b)) return `Т2: слой ${a} не может импортировать ${b}`;

  if (b === "routes" && ROUTE_FILE.test(target)) {
    return "Т3: файл маршрута не импортируется — к маршруту обращаются через getRouteApi";
  }

  if (a === "routes" && b === "routes") {
    const owner = ownerOf(target);
    if (`${from}/`.startsWith(`${owner}/`)) return null;
    if (owner.startsWith(`${ownerOf(from)}/`)) {
      return `Т3: вышестоящий сегмент не импортирует из ${owner} — поднимите код сюда`;
    }
    return `Т3: ${owner} — соседняя ветка, поднимите код к общему предку`;
  }

  return null;
}

function nameProblem(path) {
  if (layerOf(path) !== "routes") return null;

  const hidden = dirname(path).split("/").find((segment) => segment.startsWith("_"));
  if (hidden && !HIDDEN_FOLDERS.includes(hidden)) {
    return `Т5: папка ${hidden} не нужна — не-маршруты живут в ${HIDDEN_FOLDERS.join(", ")}`;
  }
  if (hidden) return null;

  const name = basename(path);
  if (path === "src/routes/__root.tsx") return null;

  const segment = kebab(basename(dirname(path)));
  const role = name.match(/^.+\.([a-z]+)\.tsx?$/)?.[1];
  const expected = `${segment}.<${SEGMENT_ROLES.join("|")}>.ts(x)`;

  if (name === "index.tsx" || name === "route.tsx") {
    return `Т5: ${name} запрещён — назовите файл ${segment}.page.tsx или ${segment}.layout.tsx`;
  }
  if (!role || !SEGMENT_ROLES.includes(role)) {
    return `Т5: в папке сегмента лежат только файлы ${expected}; компоненты, хуки и утилиты — в _components/, _hooks/, _utils/`;
  }
  if (!name.startsWith(`${segment}.${role}.`)) {
    return `Т5: файл сегмента называется по нему — ${segment}.${role}${name.slice(name.lastIndexOf("."))}`;
  }

  return null;
}

/** Папки-сегменты без *.page.tsx и *.layout.tsx: у сегмента всегда есть страница или лэйаут. */
function* emptySegments(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const folders = entries.filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"));

  if (!entries.some((entry) => entry.isFile() && ROUTE_FILE.test(entry.name))) yield dir;
  for (const folder of folders) yield* emptySegments(join(dir, folder.name));
}

function* files(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if (/\.tsx?$/.test(entry.name) && !entry.name.endsWith(".gen.ts")) yield path;
  }
}

const root = join(dirname(new URL(import.meta.url).pathname), "..");
const found = [];

for (const absolute of files(join(root, "src"))) {
  const from = relative(root, absolute);

  const naming = nameProblem(from);
  if (naming) found.push(`${from}\n  ${naming}`);

  const source = readFileSync(absolute, "utf8");

  const query = layerOf(from) === "routes" && source.match(QUERY_CODE)?.[1];
  if (query) {
    found.push(`${from}\n  Т9: ${query} в маршруте — вынесите запрос в shared/api/hooks и вызывайте хук`);
  }

  for (const [, specifier] of source.matchAll(IMPORT)) {
    const problem = importProblem(from, specifier);
    if (problem) found.push(`${from}\n  → ${specifier}\n  ${problem}`);
  }
}

for (const folder of readdirSync(join(root, "src/routes"), { withFileTypes: true })) {
  if (!folder.isDirectory() || folder.name.startsWith("_")) continue;
  for (const empty of emptySegments(join(root, "src/routes", folder.name))) {
    const segment = basename(empty);
    found.push(
      `${relative(root, empty)}/\n  Т5: у сегмента нет страницы и лэйаута — добавьте ${kebab(segment)}.page.tsx или ${kebab(segment)}.layout.tsx`,
    );
  }
}

if (found.length > 0) {
  console.error(`Нарушены правила архитектуры (${found.length}):\n\n${found.join("\n\n")}`);
  process.exit(1);
}

console.log("Правила архитектуры соблюдены.");
