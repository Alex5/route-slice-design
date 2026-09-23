// Проверяет жёсткие правила архитектуры из README:
//
// Т2. Слои: app → routes → shared, зависимости только вниз.
// Т3. Ветки маршрутов изолированы: из routes/ можно импортировать только код
//     своих предков — их -components/ и role-файлы. Соседняя ветка и сегменты
//     ниже по дереву — никогда. Файл маршрута не импортирует никто: к маршруту
//     обращаются через getRouteApi.
// Т5. Файлы маршрутов называются по своему сегменту: projects.page.tsx,
//     project-id.layout.tsx. index.tsx и route.tsx запрещены. В каждой папке-
//     сегменте есть *.page.tsx или *.layout.tsx.
//
// Импорт с `?raw` — это чтение текста, а не зависимость от модуля, он не
// проверяется (так /compare читает двух близнецов).
//
// Запуск: node scripts/check-architecture.mjs — код выхода 1, если есть нарушения.
import { readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, normalize, relative } from "node:path";

const IMPORT = /(?:from|import)\s*\(?\s*["']([^"']+)["']/g;
const ROUTE_FILE = /\.(page|layout)\.tsx$/;

function layerOf(path) {
  if (path.startsWith("src/routes/")) return "routes";
  if (path.startsWith("src/shared/")) return "shared";
  return "app";
}

/** Кто может импортировать слой: app — всех, routes — routes и shared, shared — только себя. */
const ALLOWED = { app: ["app", "routes", "shared"], routes: ["routes", "shared"], shared: ["shared"] };

/**
 * Владелец файла — папка, в чьё поддерево он входит: путь до первого сегмента
 * с дефисом (`-components`) или просто папка файла.
 */
function ownerOf(path) {
  const segments = dirname(path).split("/");
  const dash = segments.findIndex((segment) => segment.startsWith("-"));
  return (dash === -1 ? segments : segments.slice(0, dash)).join("/");
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
  if (path.split("/").some((segment) => segment.startsWith("-"))) return null;

  const name = basename(path);
  const segment = basename(dirname(path));

  if (name === "index.tsx" || name === "route.tsx") {
    return `Т5: ${name} запрещён — назовите файл ${kebab(segment)}.page.tsx или ${kebab(segment)}.layout.tsx`;
  }

  const role = name.match(ROUTE_FILE)?.[1];
  if (role && name !== `${kebab(segment)}.${role}.tsx`) {
    return `Т5: файл маршрута называется по сегменту — ${kebab(segment)}.${role}.tsx`;
  }

  return null;
}

/** Папки-сегменты без *.page.tsx и *.layout.tsx: у сегмента всегда есть страница или лэйаут. */
function* emptySegments(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const folders = entries.filter((entry) => entry.isDirectory() && !entry.name.startsWith("-"));

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

  for (const [, specifier] of readFileSync(absolute, "utf8").matchAll(IMPORT)) {
    const problem = importProblem(from, specifier);
    if (problem) found.push(`${from}\n  → ${specifier}\n  ${problem}`);
  }
}

for (const folder of readdirSync(join(root, "src/routes"), { withFileTypes: true })) {
  if (!folder.isDirectory() || folder.name.startsWith("-")) continue;
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
