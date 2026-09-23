import { Link, useLocation, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";

import { TOUR } from "#/shared/lib/tour.ts";
import { cn } from "#/shared/lib/utils.ts";
import { Badge } from "#/shared/ui/badge/badge.tsx";
import { Button } from "#/shared/ui/button/button.tsx";
import { useExplorer } from "#/shared/ui/explorer/explorer.context.tsx";

/** Where step `index` lives, with the step itself carried in the URL. */
function stepLink(index: number) {
  const { link } = TOUR[index];
  return { ...link, search: { ...link.search, tour: index } };
}

/**
 * The current tour step, above the app it talks about. The step is a search
 * param, so a tour can be linked to and survives a reload (Т7).
 */
export function TourCard() {
  const { tour } = useSearch({ strict: false });
  const { pathname } = useLocation();
  const { select } = useExplorer();

  const step = tour === undefined ? undefined : TOUR[tour];

  // Picked after the step's URL has rendered, so the navigation that brought
  // the step here does not drop the selection straight away.
  useEffect(() => {
    if (step) select(step.focus);
    // `select` changes on every hover; re-picking then would fight the reader.
  }, [step, pathname]);

  if (!step || tour === undefined) return null;

  const last = tour === TOUR.length - 1;

  return (
    <section aria-label="Экскурсия" className="shrink-0 rounded-xl border bg-card/40 px-6 py-5">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>
          Шаг {tour + 1} из {TOUR.length}
        </span>
        <Badge variant="secondary">{step.rule}</Badge>
        <div className="flex gap-1" aria-hidden="true">
          {TOUR.map((item, index) => (
            <span
              key={item.title}
              className={cn(
                "h-1 w-4 rounded-full",
                index <= tour ? "bg-layer-routes" : "bg-border",
              )}
            />
          ))}
        </div>
        <Link
          to="."
          search={(previous: Record<string, unknown>) => ({ ...previous, tour: undefined })}
          className="ms-auto transition-colors hover:text-foreground"
        >
          Закончить
        </Link>
      </div>

      <h2 className="mt-3 text-base font-semibold tracking-tight">{step.title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{step.text}</p>

      <div className="mt-4 flex gap-2">
        {tour > 0 && (
          <Button asChild size="sm" variant="ghost">
            <Link {...stepLink(tour - 1)}>Назад</Link>
          </Button>
        )}
        {last ? (
          <Button asChild size="sm">
            <a href={`${import.meta.env.BASE_URL}llms.txt`}>Открыть llms.txt</a>
          </Button>
        ) : (
          <Button asChild size="sm">
            <Link {...stepLink(tour + 1)}>Далее</Link>
          </Button>
        )}
      </div>
    </section>
  );
}
