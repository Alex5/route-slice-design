# route slice design

> Feature-Sliced Design cuts an application across features. This cuts it along
> routes instead: the slice is a URL, and where code lives follows from the
> address bar rather than from a taxonomy someone has to remember.

A small task tracker built to that rule, shown in three
columns: its own source on the left, the app running for real in the middle, and
a note about whatever is outlined on the right.

```bash
pnpm install && pnpm dev
```

Everything is genuine: `/projects/apollo/tasks?status=done` is a URL you can
paste into the address bar, the status filter lives in search params, and the
project layout stays mounted while you move between its tabs.

## Interactions

| Action | Result |
|---|---|
| hover a file on the left | the box it renders is outlined on the right |
| hover a folder on the left | every box inside it is outlined at once |
| click a file on the left | the browser navigates to the URL that file answers |
| hover a box in the app | its file lights up in the tree |
| click a box label | that file is selected and revealed in the tree |
| navigate anywhere | the tree follows the URL, because the selection is derived from it |
| **Compare twins** | `/compare` — the real source of the two task forms, side by side |

The note panel follows the hover rather than the selection, so the outline and
the words on either side of the app are always about the same file. Below 1024px
the panel is dropped and the tree keeps the full height.

Outlines are coloured by layer (`app` / `routes` / `shared`), matching the legend.

## Why the preview looks like this

Every dashed box is one file's slice of the rendered output, labelled with that
file — the device the Next.js app-router demo uses to make layout nesting
legible. Content is reduced to headings and placeholders so that nesting is the
only thing competing for attention.

The boxes are not decoration laid over a mockup. `<Boundary file="…">` takes a
repository path and nothing else, and the tree reads the same filesystem through
`import.meta.glob`, so the two cannot disagree. Rename a file and it moves in the
tree, changes its URL, and relabels its box — with no list to update.

## The duplication story

`tasks/new/index.tsx` and `tasks/$taskId/edit/index.tsx` are near-copies, and
`/compare` argues that this is the correct outcome rather than a defect.

That page imports both files as text (`?raw`) and counts how many lines occur in
both, so the percentage on screen is measured rather than asserted. It came out
lower than the number this project used to claim in prose — which is exactly the
reason to measure it.

Neither page owns what it renders. `shared/ui/section` and
`shared/ui/form-actions` know no domain types, so they live in `shared`.
`tasks/-components/task-form` knows what a `Task` is, which by § 5 disqualifies
it from `shared/ui`; it was lifted to `tasks/` on its **second** use, that being
the nearest ancestor both pages share. What stays duplicated is the assembly:
heading, defaults, which write runs, where you land afterwards.

## What dogfooding changed

- **`*.page.tsx` does not survive contact with the router.** The spec's naming
  table wants `add-task.page.tsx`; TanStack Router's file convention wants
  `index.tsx` under a `new/` folder, and a file named `add-task.page.tsx` would
  turn into a URL segment. The folder now carries the meaning and the role suffix
  applies only to non-route files. The spec should record this.
- **Typed navigation has exactly one hole.** Everything in the app navigates
  through typed `<Link to>`; the file tree, which derives a URL from a path at
  runtime, needs a cast. One line, one place, with a comment.
- **`import.meta.glob` omits the file it is written in**, so `source-tree.ts`
  had to add itself back.

## Layout

```
src/
  app/                     composition root: router, providers
  routes/                  the URL tree — folders here are the address bar
    -components/           chrome shown on every URL (header)
    __root.tsx             shell: header, file tree, <Outlet/>, note panel
    compare.tsx            /compare
    projects/
      -components/         not routable; check the URL bar
      index.tsx            /projects
      $projectId/
        route.tsx          layout, stays mounted across tabs
        tasks/
          -components/task-form/   lifted here on the second use
          new/index.tsx            twin
          $taskId/edit/index.tsx   twin
  shared/                  knows nothing about routes/ or app/
    api/                   stands in for a generated client (§ 6)
    explorer/              the tree, the note panel, the hover state
    ui/                    boundary, section, form-actions, data-table, tree-view
```

`shared/lib/source-tree.ts` is fact read from the filesystem;
`shared/lib/source-notes.ts` is the opinion attached to it. Every path in the
tree has a note — what it is, why it lives there, and what to do when you work on
it. Keeping fact and opinion apart is what lets development check both
directions: a note for a deleted path warns, and so does a path nobody has
described.

## Deploying

Pushing to `main` builds and publishes to GitHub Pages via
[.github/workflows/deploy.yml](.github/workflows/deploy.yml). Enable it once, in
**Settings → Pages → Source → GitHub Actions**.

Three things a single-page app needs on Pages, all handled:

- **Base path.** A project site is served from `/<repo>/`, so CI passes
  `BASE_PATH` to Vite and the router reads it back from `import.meta.env.BASE_URL`.
  If the repository is named `<user>.github.io`, drop that line from the
  workflow — such sites are served from the root.
- **Deep links.** Pages has no rewrite rule, so `/projects/apollo/tasks` would
  404 on a direct hit. The build writes `404.html` alongside `index.html`, which
  hands those URLs back to the client router.
- **`.nojekyll`.** Without it Pages runs the output through Jekyll, which drops
  files and folders beginning with an underscore.

The header's source link is filled in from `VITE_REPO_URL`, which the workflow
derives from the repository being built — so no URL is written down anywhere. In
development the variable is unset and the link simply does not render.

To check a Pages-shaped build locally:

```bash
BASE_PATH=/rsd/ pnpm build && BASE_PATH=/rsd/ pnpm preview
```

## Why Ark UI when the rest is shadcn

shadcn ships no tree view. Ark UI supplies the headless part — state, keyboard,
ARIA — and the appearance comes from the same shadcn tokens. The styled wrapper
lives in [tree-view.tsx](src/shared/ui/tree-view/tree-view.tsx) and copies into
another project like any other shadcn component.
