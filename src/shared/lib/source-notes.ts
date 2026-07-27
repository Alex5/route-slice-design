/**
 * Commentary attached to real files and folders by path.
 *
 * Kept apart from the tree itself: the tree is a fact read from the filesystem,
 * this is opinion. Both directions are checked in development — a note for a
 * path that no longer exists warns, and so does a file nobody has described.
 */
import { nodeByPath } from "#/shared/lib/source-tree.ts";

export interface SourceNote {
  /** File role, per § 3 of the spec. */
  role?: string;
  /** The point worth remembering, shown as a callout. */
  note?: string;
  /** What this is and why it lives here. */
  doc?: string;
  /** What to do when you need to work on it. */
  use?: string;
  /** Spec reference. */
  rule?: string;
  /** Blocks this file is composed of, by path. */
  composedOf?: string[];
}

const R = "src/routes/projects";
const P = `${R}/$projectId`;
const TASKS = `${P}/tasks`;
const UI = "src/shared/ui";
const EXPLORER = "src/shared/explorer";

export const sourceNotes: Record<string, SourceNote> = {
  /* ── the three layers ─────────────────────────────────────────────────── */

  src: {
    doc: "Three layers and no more: app composes, routes owns the URL tree, shared holds what belongs to no single route. Dependencies point downward only.",
    use: "Before adding a top-level folder, ask which of the three it would belong to. The answer is nearly always one of them.",
    rule: "§ 2",
  },

  "src/app": {
    doc: "The composition root — the only layer allowed to know about every other one. Nothing here renders application content.",
    use: "Put things here that must exist exactly once for the whole app: the router, providers, global styles.",
    rule: "§ 2",
  },
  "src/app/providers": {
    doc: "Context providers wrapping the entire tree.",
    use: "Add a provider by nesting it inside with-providers.tsx rather than at a call site, so the order stays visible in one file.",
  },
  "src/app/providers/with-providers.tsx": {
    role: "provider",
    doc: "One assembly point for providers, so their nesting order is legible instead of smeared across main.tsx.",
    use: "Wrap new providers here. If a provider is only needed under one URL, it belongs in that route's layout instead.",
    rule: "§ 2",
  },
  "src/app/router.tsx": {
    role: "router",
    doc: "Builds the router from the generated route tree and registers its types globally, which is what makes every <Link to> checked at compile time.",
    use: "Never list a route here — routes come from folders. Change router-wide policy (preloading, scroll restoration) in this file only.",
    rule: "§ 10",
  },
  "src/main.tsx": {
    role: "entry",
    doc: "Mounts the router into #root. Deliberately the shortest file in the repository.",
    use: "Resist adding anything here; app-wide concerns belong in app/providers.",
  },
  "src/styles.css": {
    doc: "Tailwind v4 setup plus the shadcn token palette, and the three layer colours used by the tree, the legend and every outline.",
    use: "Change a layer colour here and it changes everywhere at once — the tokens are the single vocabulary.",
  },

  /* ── routes ───────────────────────────────────────────────────────────── */

  "src/routes": {
    doc: "The URL tree. Every folder here is a path segment, so where code lives follows from the address bar rather than from a convention someone has to remember.",
    use: "Create a folder to create a URL. Prefix it with a dash to keep it out of routing.",
    rule: "§ 1 · ADR-0001",
  },
  "src/routes/-components": {
    doc: "Chrome belonging to every URL. Dash-prefixed at the very top of routes/, so the rule that keeps folders out of routing applies at the root exactly as it does deeper down.",
    use: "Put something here only when it must appear on every page; anything narrower belongs to a nested route.",
    rule: "§ 3",
  },
  "src/routes/-components/site-header": {
    doc: "The application header: wordmark, stack badges, link to the source.",
    use: "The one place to change branding. The source link appears only when a build supplies VITE_REPO_URL, which the deploy workflow does.",
  },
  "src/routes/-components/site-header/site-header.tsx": {
    doc: "The wordmark deliberately echoes Feature-Sliced Design, because this is the opposing answer to the same question: the slice is a route, not a feature. Version numbers are read from package.json rather than typed in, for the same reason the tree is read from the filesystem.",
    use: "Add a badge by naming a package in STACK; if the dependency is dropped, its number simply disappears.",
  },
  "src/routes/__root.tsx": {
    role: "layout",
    doc: "The shell every URL renders inside: header on top, the source tree on the left, an <Outlet/> in the middle, this note on the right. A real root layout, which is why the tree keeps its scroll and expansion as you navigate.",
    use: "Add chrome that must survive every navigation here. Anything URL-specific belongs in a nested layout instead.",
    rule: "§ 2",
  },
  "src/routes/index.tsx": {
    role: "page",
    doc: "Answers `/` with a redirect to /projects. It exists because a bare origin has to resolve to something.",
    use: "Change the landing route here; it is a one-line beforeLoad.",
  },
  "src/routes/compare.tsx": {
    role: "page",
    note: "Reads the two twin files as text and measures how alike they are.",
    doc: "Imports both task forms with Vite's ?raw, marks lines occurring in both, and prints the resulting percentage. The claim cannot drift away from the code the way a comment would.",
    use: "Nothing to maintain: rename or rewrite either twin and the number recomputes on the next build.",
    rule: "§ 5",
  },

  /* ── /projects ────────────────────────────────────────────────────────── */

  [R]: {
    doc: "Everything reachable under /projects. The folder is both the URL segment and the module boundary.",
    use: "Delete this folder and the feature is gone with no leftovers anywhere else — that is the property the whole architecture is built for.",
    rule: "§ 1",
  },
  [`${R}/index.tsx`]: {
    role: "page",
    doc: "An orchestrator: heading, list, action. It holds no networking and no business logic of its own.",
    use: "Keep pages this thin. When one grows past composition, push the weight down into a -components folder.",
    rule: "§ 4",
  },
  [`${R}/-components`]: {
    doc: "The dash keeps the folder out of routing — check the URL bar, nothing in here is addressable. Everything inside belongs to /projects and to nothing else.",
    use: "Put a component here the moment it is used twice on this page, and no earlier.",
    rule: "§ 3 · § 5",
  },
  [`${R}/-components/add-project-button`]: {
    role: "Command Component",
    doc: "One user action, self-contained: trigger, dialog state and the write itself. Named verb-noun-button so the folder listing reads as a list of what the user can do.",
    use: "Copy this folder to add another action. Adding one touches no existing file except a single line of JSX in the page.",
    rule: "§ 4 · ADR-0003",
  },
  [`${R}/-components/add-project-button/add-project-button.tsx`]: {
    doc: "Owns its own open state. The page renders <AddProjectButton /> with no props and never learns what pressing it does.",
    use: "If this file passes ~120 lines or gains a second write, move the logic into a sibling hook and leave markup here.",
    rule: "§ 4",
  },
  [`${R}/-components/projects-table`]: {
    doc: "The project list as rendered on this one page.",
    use: "Keep it here while only /projects lists projects. A second lister elsewhere is what would justify moving it.",
    rule: "§ 5",
  },
  [`${R}/-components/projects-table/projects-table.tsx`]: {
    doc: "Reads its own data and owns its own navigation, so the page above stays free of plumbing.",
    use: "Swap the mock import for a real query hook and nothing above this file changes.",
    rule: "§ 9",
    composedOf: [`${UI}/data-table/data-table.tsx`],
  },

  /* ── /projects/$projectId ─────────────────────────────────────────────── */

  [P]: {
    doc: "A dynamic segment is a real folder. Everything belonging to one project lives inside it, at the same depth the URL puts it.",
    use: "Anything shared by several project pages goes in this folder's -components, not in shared/.",
    rule: "§ 1 · ADR-0001",
  },
  [`${P}/route.tsx`]: {
    role: "layout",
    doc: "The project shell: title, tabs, <Outlet/>. It stays mounted while you move between Overview and Tasks, which is the entire reason layouts are separate files.",
    use: "Load data once here for the whole subtree. Watch the outline survive a tab change — that is the layout not remounting.",
    rule: "§ 9",
  },
  [`${P}/index.tsx`]: {
    role: "page",
    doc: "What /projects/apollo itself shows, as opposed to what its layout shows. Splitting the two is what lets the shell persist.",
    use: "Put project-level summary content here; anything framing it belongs in route.tsx.",
  },
  [`${P}/-components`]: {
    doc: "Shared by every page under this project and by nothing outside it — the exact condition for living one level up rather than in shared/.",
    use: "Move a component here on its second use inside the project.",
    rule: "§ 5",
  },
  [`${P}/-components/project-tabs`]: {
    doc: "Navigation between the project's sections.",
    use: "Add a tab by adding a <Link>; the target must already exist as a folder or the build fails.",
  },
  [`${P}/-components/project-tabs/project-tabs.tsx`]: {
    doc: "Not one string path in JSX: <Link to> is typed from the generated route tree, so renaming a folder breaks the build instead of the app.",
    use: "Never hand-build a URL. If you find yourself with a string, you are working around the router.",
    rule: "§ 10",
  },

  /* ── /projects/$projectId/tasks ───────────────────────────────────────── */

  [TASKS]: {
    doc: "The task section: a list, a create form, a detail page and an edit form. Four URLs, four folders.",
    use: "This is the branch to read first — it exercises every rule in the spec at once.",
  },
  [`${TASKS}/index.tsx`]: {
    role: "page",
    doc: "An orchestrator: heading, filter, table, link to the create form. It owns the search-param contract for this URL and nothing else.",
    use: "Add a filter by extending validateSearch here, then reading it in a component under -components/filters.",
    rule: "§ 4 · § 8",
  },
  [`${TASKS}/-components`]: {
    doc: "Pieces used by more than one task URL but by nothing outside the task section.",
    use: "Three things live here for three different reasons: filters and the table serve the list, the form serves both write pages.",
    rule: "§ 5",
  },
  [`${TASKS}/-components/filters`]: {
    doc: "Controls that write to the URL rather than to component state.",
    use: "Add a filter as its own file here; each one reads and writes a single search param.",
    rule: "§ 8",
  },
  [`${TASKS}/-components/filters/status-filter.tsx`]: {
    doc: "Filter state lives in the route's search params, not in useState: the link survives a reload and can be handed to someone else. Click a status and watch the address bar.",
    use: "It reaches its route through getRouteApi instead of importing the page file — that is how a -components file talks to its route without a sibling import.",
    rule: "§ 8",
  },
  [`${TASKS}/-components/tasks-table`]: {
    doc: "The task list as rendered under this project.",
    use: "Keep presentation here and filtering in the page: the table renders whatever rows it is handed.",
  },
  [`${TASKS}/-components/tasks-table/tasks-table.tsx`]: {
    doc: "Knows what a Task looks like and how to navigate to one; leaves deciding which tasks to show to the page above.",
    use: "Change a column here. Change which rows appear in the page.",
    composedOf: [`${UI}/data-table/data-table.tsx`],
  },
  [`${TASKS}/-components/task-form`]: {
    role: "lifted block",
    note: "Lifted here on the second use — not before.",
    doc: "Both task forms need these fields, and their nearest common ancestor is tasks/. So the block sits one level up rather than in shared/: it knows what a Task is, which is exactly what disqualifies it from shared/ui.",
    use: "This is the rule in action — when a second caller appears, move the code to the nearest ancestor both callers share, and no further.",
    rule: "§ 5",
  },
  [`${TASKS}/-components/task-form/task-form-fields.tsx`]: {
    doc: "The field set both write pages render. It takes an optional task, which is the only difference between creating and editing.",
    use: "Add a field here once and both forms get it. If a field belongs to only one of them, put it in that page instead.",
    rule: "§ 5",
  },
  [`${TASKS}/new`]: {
    doc: "The create URL. A folder rather than a file because the router turns folders into segments.",
    use: "Its page is index.tsx — the spec's *.page.tsx suffix does not survive here, since a dot-named file would become another URL segment.",
    rule: "§ 3",
  },
  [`${TASKS}/new/index.tsx`]: {
    role: "page",
    note: "Nearly a copy of tasks/$taskId/edit/index.tsx. Leave it that way.",
    doc: "Both pages assemble the same blocks, so what stays duplicated is only the assembly: heading, defaults, which write runs, where you land afterwards. Merging them behind a mode prop would trade four honest lines for a branch in every block below.",
    use: "Open /compare to see the measured overlap. When the two drift apart, this file changes and the other does not.",
    rule: "§ 5",
    composedOf: [
      `${UI}/section/section.tsx`,
      `${TASKS}/-components/task-form/task-form-fields.tsx`,
      `${UI}/form-actions/form-actions.tsx`,
    ],
  },
  [`${TASKS}/$taskId`]: {
    doc: "One task. The detail page and everything reachable from it.",
    use: "Its loader is the place to fetch the task once for this URL and everything nested under it.",
    rule: "§ 9",
  },
  [`${TASKS}/$taskId/index.tsx`]: {
    role: "page",
    doc: "The task itself. Its loader resolves the task before render and throws notFound when the id is unknown — try editing TF-999 in the address bar.",
    use: "Read route data through Route.useLoaderData rather than passing it down as props.",
    rule: "§ 9",
  },
  [`${TASKS}/$taskId/edit`]: {
    doc: "The edit URL, a sibling of the task rather than a mode of it. Being a separate address is what lets it be a separate file.",
    use: "Compare this folder with tasks/new — the symmetry is the point.",
  },
  [`${TASKS}/$taskId/edit/index.tsx`]: {
    role: "page",
    note: "Nearly a copy of tasks/new/index.tsx. That is the correct outcome.",
    doc: "The two will drift: edit grows an audit trail, create grows a template picker. Because neither was folded into a shared wrapper, each change touches one file and neither page grows a flag it has to answer for.",
    use: "When you are tempted to merge the twins, write down what the mode prop would have to control. That list is the cost.",
    rule: "§ 5",
    composedOf: [
      `${UI}/section/section.tsx`,
      `${TASKS}/-components/task-form/task-form-fields.tsx`,
      `${UI}/form-actions/form-actions.tsx`,
    ],
  },

  /* ── /board — state that is neither on the server nor in the URL ──────── */

  "src/routes/board": {
    doc: "A scratch board. Nothing here is saved and nothing is addressable beyond the screen itself, which is what makes it a store case rather than a URL case.",
    use: "Reach for this shape when state is complex, local and long-lived within one screen.",
    rule: "§ 8",
  },
  "src/routes/board/board.store.ts": {
    role: "store",
    note: "The store sits beside the route, not in shared.",
    doc: "Zustand for complex local state, colocated because nothing outside /board has any use for it. Cards are grouped by column so a move replaces exactly two arrays and the rest keep their identity. Server data in here would be a mistake — that belongs to the query layer.",
    use: "Named .ts, not .tsx: the suffix carries the role, the extension still has to tell the truth about the contents.",
    rule: "§ 8 · § 3",
  },
  "src/routes/board/index.tsx": {
    role: "page",
    doc: "Composes the columns and owns nothing else. The page never holds the cards; each column subscribes for itself.",
    use: "Compare with /projects: same page shape, different origin of state.",
  },
  "src/routes/board/-components": {
    doc: "Pieces of the board, unusable anywhere else.",
    use: "Same rule as everywhere: the dash keeps the folder out of routing.",
    rule: "§ 3",
  },
  "src/routes/board/-components/board-column": {
    doc: "One column of the board.",
    use: "It reads the store directly, so adding a column costs one line in the page.",
  },
  "src/routes/board/-components/board-column/board-column.tsx": {
    doc: "Subscribes to its own column instead of taking cards through props. A selector that built a new array on every call would loop forever under zustand v5 — the shape of the store is what makes the subscription cheap and stable.",
    use: "This is the payoff of a store over context: precise subscriptions without splitting providers.",
    rule: "§ 8",
  },

  /* ── /wizard — state shared by one subtree ────────────────────────────── */

  "src/routes/wizard": {
    doc: "A three-step draft. The steps must agree on one object, but that object dies with the screen.",
    use: "Reach for this shape when several components share state and none of them outlive the screen.",
    rule: "§ 8",
  },
  "src/routes/wizard/wizard.context.tsx": {
    role: "context",
    note: "Native context, deliberately not a store.",
    doc: "A store would outlive the screen and a prop chain would thread through every step. Context is the size of the problem: scoped to a subtree, gone when it unmounts.",
    use: "Named .tsx because the provider is a component — the role is in the suffix, the extension describes the contents.",
    rule: "§ 8 · § 3",
  },
  "src/routes/wizard/index.tsx": {
    role: "page",
    doc: "Mounts the provider and renders the current step. The step index is never passed down.",
    use: "Note where the provider sits: inside the page, not in app/providers, because nothing above this route needs it.",
    rule: "§ 2",
  },
  "src/routes/wizard/-components": {
    doc: "Pieces of the wizard, unusable anywhere else.",
    rule: "§ 3",
  },
  "src/routes/wizard/-components/wizard-steps": {
    doc: "The step indicator.",
    use: "It reads context rather than props, which is why the page stays a composition.",
  },
  "src/routes/wizard/-components/wizard-steps/wizard-steps.tsx": {
    doc: "Reads the step from context and writes it back. The page above passes nothing.",
    use: "Compare with board-column: both avoid prop drilling, at two different scopes.",
    rule: "§ 8",
  },

  /* ── shared ───────────────────────────────────────────────────────────── */

  "src/shared": {
    doc: "Everything that belongs to no single route. It knows nothing about routes/ or app/ — the one invariant actually worth enforcing in CI.",
    use: "Promote code here only on its third use, or on its first use from a second branch of the route tree.",
    rule: "§ 2 · § 5",
  },
  "src/shared/api": {
    doc: "The data layer. In a real application this folder would be generated from an OpenAPI contract and never written by hand.",
    use: "Treat generated files as read-only and extend them, rather than restating their types.",
    rule: "§ 6",
  },
  "src/shared/api/mock-data.ts": {
    doc: "Static stand-in for the API: the shapes play the part of generated types so the routes above can be written the way the spec expects.",
    use: "Replace with a generated client and the route files keep working — they only depend on the shapes.",
    rule: "§ 6",
  },

  "src/shared/lib": {
    doc: "Pure functions with no React in them.",
    use: "If something here imports a component, it is in the wrong folder.",
  },
  "src/shared/lib/source-tree.ts": {
    note: "The tree on the left is this repository, not a description of it.",
    doc: "import.meta.glob hands over Vite's module graph, and routeForPath derives each URL with the same rules the router uses. Nothing is maintained by hand.",
    use: "Rename any file and watch it move in the tree, change its URL and relabel its outline, with no list to update.",
  },
  "src/shared/lib/source-notes.ts": {
    doc: "The prose you are reading. Separate from the tree on purpose: the tree is fact, this is opinion, and the two rot at different rates.",
    use: "Add a key for any path. Development warns about notes for deleted files and about files nobody has described yet.",
  },
  "src/shared/lib/utils.ts": {
    doc: "cn() — merges class names so a later Tailwind class wins over an earlier one.",
    use: "Use it anywhere a component takes a className prop.",
  },

  "src/shared/lib/source-code.ts": {
    doc: "The text of every file, loaded on demand through Vite's ?raw. What the reader sees is what is on disk, not a copy pasted into a document.",
    use: "A glob never includes the file it is written in, so this one imports itself directly to stay readable.",
  },
  "src/shared/explorer": {
    doc: "The explanatory overlay: the tree, the note panel, and the shared idea of which file is being pointed at.",
    use: "This is the only part of the app that is about the app. Everything else is an ordinary task tracker.",
  },
  [`${EXPLORER}/explorer.context.tsx`]: {
    doc: "Which file is hovered or selected. It holds no route state: navigation is the router's job, and the selected file is derived from the URL.",
    use: "Read activePath when you need to know what the user is pointing at; it already merges hover and selection.",
    rule: "§ 8",
  },
  [`${EXPLORER}/explorer.tsx`]: {
    doc: "The left column: legend plus tree, at full height.",
    use: "Add a legend entry here when a fourth layer appears — which the spec says should make you stop and think first.",
  },
  [`${EXPLORER}/file-tree.tsx`]: {
    doc: "Renders the source tree and navigates on click. It shows each file's URL in the margin, so which files are addressable is visible at a glance.",
    use: "Note the single cast inside: the tree derives a URL string at runtime, the one place typed navigation cannot reach.",
    rule: "§ 10",
  },
  [`${EXPLORER}/note-panel.tsx`]: {
    doc: "This panel. It follows activePath rather than the selection, so the outline and the words are always about the same file.",
    use: "Everything shown here comes from source-notes.ts; nothing is hardcoded per file.",
  },

  [UI]: {
    doc: "Presentational primitives that know no domain types. Knowing what a Task is disqualifies a component from this folder.",
    use: "Before adding here, check the test: could this file be dropped into an unrelated app unchanged? If not, it belongs in the route tree.",
    rule: "§ 5",
  },
  [`${UI}/boundary`]: {
    doc: "The dashed outline that names the file rendering what is inside it.",
    use: "Wrap anything you want to be explainable. One prop, a repository path.",
  },
  [`${UI}/boundary/boundary.tsx`]: {
    doc: "Takes a path and nothing else, and the tree reads the same filesystem — so a label and the tree cannot disagree.",
    use: "Wrap a new component in a <Boundary> pointing at its path and it joins the map with no registration step.",
    rule: "§ 5",
  },
  [`${UI}/source-view`]: {
    doc: "Renders a file as text with line numbers.",
    use: "Open it from the note panel, or link straight to it — the file being read is a search param.",
    rule: "§ 8",
  },
  [`${UI}/source-view/source-view.tsx`]: {
    doc: "Loads a file on demand and prints it. No highlighting on purpose: the point is what the code says, not how it looks.",
    use: "Reading a file is addressable, so a review comment can link to the exact source the reader should see.",
  },
  [`${UI}/section`]: {
    doc: "Titled container used by both write pages.",
    use: "Compose it; do not extend it with domain-specific props.",
  },
  [`${UI}/section/section.tsx`]: {
    doc: "Heading plus bordered body. Both task pages compose it and it has no idea either of them exists — which is what earns it a place in shared.",
    use: "If it ever needs to know about tasks, that is the signal to move it down into the route tree.",
    rule: "§ 5",
  },
  [`${UI}/form-actions`]: {
    doc: "The submit and cancel row.",
    use: "Pass the label in. A component that branches on create-versus-edit has taken on knowledge it should not have.",
  },
  [`${UI}/form-actions/form-actions.tsx`]: {
    doc: "Labels and handlers arrive as props, so “Create task” and “Save changes” need no branch inside.",
    use: "This is how the twins share a component without sharing a mode flag.",
    rule: "§ 5",
  },
  [`${UI}/data-table`]: {
    doc: "The list primitive both tables are built on.",
    use: "Give it rows and a row renderer; it decides nothing about the data.",
  },
  [`${UI}/data-table/data-table.tsx`]: {
    doc: "Generic over the row type and ignorant of Task and Project, which is precisely why it is allowed in shared.",
    use: "Both tables in the app compose it while keeping their own columns and their own navigation.",
    rule: "§ 5",
  },
  [`${UI}/pill`]: {
    doc: "The small button used for tabs, filters and actions.",
    use: "Reach for it before writing another one-off button.",
  },
  [`${UI}/pill/pill.tsx`]: {
    doc: "Disabled when it has no handler, so a decorative pill cannot pretend to be interactive.",
    use: "Pass onClick to make it live; omit it to show state.",
  },
  [`${UI}/skeleton`]: {
    doc: "Placeholder bars standing in for content the example does not need to spell out.",
    use: "Used deliberately throughout so structure stays the loudest thing on screen.",
  },
  [`${UI}/skeleton/skeleton.tsx`]: {
    doc: "A grey bar. The reason the preview reads as architecture rather than as a product screenshot.",
    use: "Give it a width class; it has no other behaviour.",
  },
  [`${UI}/badge`]: {
    doc: "Small status label, straight from shadcn.",
    use: "Used by the note panel for layer, role and spec reference.",
  },
  [`${UI}/badge/badge.tsx`]: {
    doc: "An unmodified shadcn component, kept as a file in the repository the way shadcn intends.",
    use: "Edit it freely — there is no upstream to fight with.",
  },
  [`${UI}/tree-view`]: {
    doc: "The tree component shadcn does not ship.",
    use: "Copy this folder into another project; it depends only on Ark UI and the shadcn tokens.",
  },
  [`${UI}/tree-view/tree-view.tsx`]: {
    doc: "Ark UI supplies state, keyboard handling and ARIA; the appearance comes from the same shadcn tokens as everything else, so it does not read as a foreign component.",
    use: "Style it by editing the class strings here, not by overriding from the outside.",
  },
};

/** Notes pointing at paths that no longer exist. */
export const staleNotePaths = Object.keys(sourceNotes).filter((path) => !nodeByPath.has(path));

/** Files and folders nobody has described yet. */
export const undocumentedPaths = [...nodeByPath.keys()].filter((path) => !sourceNotes[path]);

if (import.meta.env.DEV) {
  if (staleNotePaths.length > 0) {
    console.warn("[source-notes] notes for paths that no longer exist:", staleNotePaths);
  }
  if (undocumentedPaths.length > 0) {
    console.warn(
      `[source-notes] ${undocumentedPaths.length} paths without a note:`,
      undocumentedPaths,
    );
  }
}
