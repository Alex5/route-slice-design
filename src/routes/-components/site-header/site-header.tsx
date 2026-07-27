import { Github } from "lucide-react";

import pkg from "#package";

/**
 * Filled in by the deploy workflow from the repository the build came from, so
 * no URL is written down anywhere. Absent in development, and the link then
 * simply does not render.
 */
const REPO_URL = import.meta.env.VITE_REPO_URL;

/**
 * Versions come from package.json rather than from a list someone remembers to
 * update — the same reason the file tree is read from the filesystem.
 */
function version(name: string) {
  const raw =
    (pkg.dependencies as Record<string, string>)[name] ??
    (pkg.devDependencies as Record<string, string>)[name];

  if (!raw) return null;

  const [major, minor] = raw.replace(/^[^\d]*/, "").split(".");
  return minor ? `${major}.${minor}` : major;
}

const STACK = [
  { label: "React", package: "react" },
  { label: "TanStack Router", package: "@tanstack/react-router" },
  { label: "Vite", package: "vite" },
  { label: "Tailwind", package: "tailwindcss" },
  { label: "Ark UI", package: "@ark-ui/react" },
];

export function SiteHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b px-5">
      {/* The accent on "slice" is the same green the tree uses for the routes
          layer, so the wordmark names the thing it is about. */}
      <span className="text-[15px] font-semibold lowercase tracking-tight">
        route <span className="text-layer-routes">slice</span> design
      </span>

      <p className="hidden border-s ps-4 text-xs text-muted-foreground md:block">
        a task tracker with its own structure showing
      </p>

      <div className="ms-auto flex items-center gap-1.5">
        <div className="hidden items-center gap-1.5 lg:flex">
          {STACK.map((item) => {
            const number = version(item.package);
            return (
              <span
                key={item.package}
                className="rounded-md border border-white/10 px-2 py-1 text-[11px] text-muted-foreground"
              >
                {item.label}
                {number && <span className="ms-1.5 font-mono text-foreground/70">{number}</span>}
              </span>
            );
          })}
        </div>

        {REPO_URL && (
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Source on GitHub"
            title="Source on GitHub"
            className="flex size-8 items-center justify-center rounded-md border border-white/10 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Github className="size-4" />
          </a>
        )}
      </div>
    </header>
  );
}
