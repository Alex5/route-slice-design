import { useLocation, useNavigate } from "@tanstack/react-router";

import { VARIANTS, variantForPath } from "#/shared/lib/variants.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/shared/ui/select/select.tsx";
import pkg from "#package";

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
  { label: "Shiki", package: "shiki" },
];

export function SiteHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const current = variantForPath(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b px-5">
      {/* The accent on "slice" is the same green the tree uses for the routes
          layer, so the wordmark names the thing it is about. */}
      <span className="text-[15px] font-semibold lowercase tracking-tight">
        route <span className="text-layer-routes">slice</span> design
      </span>

      {/* The variant switches the whole application, stack included — so it is a
          select over stacks, not a tab bar over screens. */}
      <Select
        value={current.id}
        onValueChange={(id) => {
          const next = VARIANTS.find((variant) => variant.id === id);
          if (next) navigate({ to: next.to });
        }}
      >
        <SelectTrigger size="sm" aria-label="Stack" className="hidden w-36 text-xs md:flex">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {VARIANTS.map((variant) => (
            <SelectItem key={variant.id} value={variant.id} className="text-xs">
              {variant.label}
              {variant.built ? "" : " — not written yet"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
        <a
          href="https://github.com/Alex5/route-slice-design"
          target="_blank"
          rel="noreferrer"
          aria-label="Source on GitHub"
          title="Source on GitHub"
          className="flex size-8 items-center justify-center rounded-md border border-white/10 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            data-v-2183b0a6=""
            className="iconify iconify--simple-icons"
          >
            <path
              fill="currentColor"
              d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            ></path>
          </svg>
        </a>
      </div>
    </header>
  );
}
