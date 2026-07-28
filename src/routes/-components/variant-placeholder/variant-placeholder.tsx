import { VARIANTS } from "#/shared/lib/variants.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";

const FILE = "src/routes/-components/variant-placeholder/variant-placeholder.tsx";

/**
 * Stands in for a stack that has not been written yet. It states what would
 * fill each role, because that mapping is the only thing a variant decides —
 * the folder rules above it do not change.
 */
export function VariantPlaceholder({ id }: { id: string }) {
  const variant = VARIANTS.find((candidate) => candidate.id === id);
  if (!variant) return null;

  return (
    <Boundary file={FILE} label={`${id}/index.tsx`} className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{variant.label}</h2>
        <p className="mt-1 max-w-prose text-xs leading-relaxed text-muted-foreground">
          Not written yet. The rules would not change: folders under this one are still URL
          segments, a dash still keeps a folder out of routing, and a block still moves up on its
          second use. Only the tools filling each role are different.
        </p>
      </div>

      <dl className="max-w-sm space-y-2 text-xs">
        {variant.stack.map((entry) => (
          <div key={entry.role} className="flex gap-3 border-b border-white/5 pb-2">
            <dt className="w-28 shrink-0 text-muted-foreground">{entry.role}</dt>
            <dd>{entry.tool}</dd>
          </div>
        ))}
      </dl>
    </Boundary>
  );
}
