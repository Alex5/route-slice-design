/**
 * The stacks this repository can be read in.
 *
 * The architecture names roles — a page, a layout, a lifted block, client state,
 * server state. A variant names the tools that fill those roles. Keeping the two
 * apart is the point: a store library is an implementation decision, not an
 * architectural one, and it belongs to a variant rather than to the rules.
 */

export interface Variant {
  id: string;
  label: string;
  /** What fills each role in this variant. */
  stack: { role: string; tool: string }[];
  /** Where the variant starts. */
  to: string;
  built: boolean;
}

export const VARIANTS: Variant[] = [
  {
    id: "react",
    label: "React",
    stack: [
      { role: "routing", tool: "TanStack Router" },
      { role: "server state", tool: "React Query" },
      { role: "client state", tool: "native context" },
    ],
    to: "/react/projects",
    built: true,
  },
  {
    id: "vue",
    label: "Vue",
    stack: [
      { role: "routing", tool: "Vue Router" },
      { role: "server state", tool: "TanStack Query" },
      { role: "client state", tool: "Pinia" },
    ],
    to: "/vue",
    built: false,
  },
  {
    id: "angular",
    label: "Angular",
    stack: [
      { role: "routing", tool: "Angular Router" },
      { role: "server state", tool: "HttpClient + resource" },
      { role: "client state", tool: "signals" },
    ],
    to: "/angular",
    built: false,
  },
];

export function variantForPath(pathname: string) {
  return VARIANTS.find((variant) => pathname.startsWith(`/${variant.id}`)) ?? VARIANTS[0];
}
