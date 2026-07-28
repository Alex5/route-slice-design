# route slice design

Feature-Sliced Design cuts an application across features. This cuts it along
routes: **the slice is a URL**. Where code lives follows from the address bar,
not from a taxonomy someone has to remember.

This repository is the argument and the evidence at once — a small app built to
the rule, rendered beside a tree of its own source.

```bash
pnpm install && pnpm dev
```

## The pillars

**1. The slice is a route.** A folder under `routes/` is a URL segment and a
module boundary at the same time. Deleting a screen is deleting one folder, with
nothing left behind anywhere else.

**2. Role by suffix.** `*.loader.ts`, `*.store.ts`, `*.context.tsx`,
`*.utils.ts`. A component is the default and needs no suffix; only what differs
from it gets named.

**3. Three layers, dependencies downward.** `app/` composes, `routes/` owns the
URL tree, `shared/` holds what belongs to no single route. `shared/` never
imports from `routes/`, and no route branch imports from another. This is the
one invariant worth enforcing in CI.

**4. Command Component.** One user action is one folder: trigger, state, write,
invalidation. The parent renders `<AddProjectButton />` with no props. Adding an
action touches no existing file but one line of JSX.

**5. Lift on the second use, not before.** First use: in place. Second use: the
nearest ancestor both callers share. Third, or from another branch: `shared/`.
Duplication before that point is correct, not debt.

**6. State by origin, not by convenience.** Server, in the URL, shared by one
subtree, trivially local — four different origins, four different homes. The
architecture names the origin; **the variant names the tool**. Which query
library or store fills a role is an implementation decision and belongs to a
stack, not to the rules.

**7. The contract is the source of truth.** Backend types are generated, never
written by hand; form schemas extend the generated ones rather than restating
them. A view never maps a DTO.

**8. One network boundary.** `shared/client` is the only place that knows the
base URL, credentials and the shape of an error — and the only place an error
becomes something on screen.

**9. Typed navigation.** No string paths in JSX. Renaming a folder breaks the
build, not the app.

## What this repository shows

One application, written to the rules, in a stack you pick from the header.

| Variant | Routing | Server state | Client state | |
|---|---|---|---|---|
| **React** | TanStack Router | React Query | native context | built |
| Vue | Vue Router | TanStack Query | Pinia | not written yet |
| Angular | Angular Router | HttpClient | signals | not written yet |

The variant is the first URL segment, so switching stacks is navigation like
everything else. The folder rules do not change between variants — only what
fills each role does. That separation is the answer to a fair objection: a store
library appearing among the pillars made the architecture look less definite
than it is.

## Reading it

The middle column is the app running for real. Every dashed box is one file's
slice of the output, labelled with that file; nesting of boxes is nesting of
layouts.

Selection is persistent, hover only previews — the two never compete for the
same highlight:

- click a file on the left — the browser navigates to the URL it answers, and
  the file stays selected
- navigate anywhere in the app — the tree reveals the branch and selects the
  file that renders it
- hover a file — its box is outlined at the lighter weight, and the selection
  stays lit
- hover a folder — every box inside it is outlined at once
- hover a box in the app — its file lights up in the tree, same lighter weight
- **Preview / Code** in the preview header — what the route renders, or the file
  that renders it. Clicking a file that answers no URL (`wizard.context.tsx`,
  `*.loader.ts`) opens its code straight away, since there is nothing to preview.
  The open file is addressable as `?source=<path>`
- **Compare twins** — `/compare` puts the two task forms side by side and
  measures how alike they are

Nothing on screen is a drawing of the code. The tree is read from the filesystem
with `import.meta.glob`, every box points at a real path, and the source view and
the comparison read the files themselves. A rename moves a file in the tree,
changes its URL and relabels its box, with no list to update.

Every path carries a note — what it is, why it lives there, what to do when you
work on it. Development warns both ways: a note for a path that no longer
exists, and a path nobody has described.

## What dogfooding changed

- **`*.page.tsx` does not survive contact with the router.** TanStack Router
  wants `index.tsx` under a `new/` folder; a dot-named file would become a URL
  segment. The folder carries the meaning, and the role suffix applies only to
  non-route files.
- **Typed navigation has exactly one hole.** Opening a file derives a URL from a
  path at runtime and needs a cast. One line, one place, commented.
- **Matching a rendered URL against a derived one is not enough.** It only ever
  worked for the parameter values baked into the derivation, so `/tasks/TF-138`
  selected nothing. The router's own match is asked instead.
- **The twins are less alike than claimed.** `/compare` measures it instead of
  asserting it, and the measured figure came out below the one this project used
  to state in prose.

## Deploying

Pushing to `main` publishes to GitHub Pages via
[.github/workflows/deploy.yml](.github/workflows/deploy.yml). Enable it once in
**Settings → Pages → Source → GitHub Actions**.

Three things a single-page app needs there, all handled: the **base path** (CI
passes `BASE_PATH`, the router reads `import.meta.env.BASE_URL`), **deep links**
(the build writes `404.html`, since Pages has no rewrite rule), and
**`.nojekyll`** (or Pages drops files beginning with an underscore).

To check a Pages-shaped build locally:

```bash
BASE_PATH=/rsd/ pnpm build && BASE_PATH=/rsd/ pnpm preview
```

## Layout

```
src/
  app/                     composition root: router, providers
  routes/                  the URL tree — folders here are the address bar
    -components/           chrome on every URL (header)
    __root.tsx             shell: header, tree, <Outlet/>, note panel
    compare.tsx            /compare
    react/                 the built variant
      projects/            server state and URL state
      wizard/              state shared by one subtree
    vue/  angular/         the same app in other stacks, not written yet
  shared/                  knows nothing about routes/ or app/
    api/                   stands in for a generated client
    explorer/              the tree, the note panel, the hover state
    lib/                   source-tree (fact) and source-notes (opinion)
    ui/                    boundary, source-view, section, form-actions, …
```

shadcn ships no tree view, so
[tree-view.tsx](src/shared/ui/tree-view/tree-view.tsx) dresses Ark UI's headless
primitives in the same shadcn tokens as everything else; it copies into another
project like any other shadcn component.
