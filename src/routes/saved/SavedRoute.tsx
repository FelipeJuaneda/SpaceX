import { useQuery } from "@tanstack/react-query";
import { useDeferredValue, useMemo } from "react";
import { useSearchParams } from "react-router";
import type { LaunchSummary } from "@/types/domain";
import { PageMeta } from "@/components/layout/PageMeta";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Choice } from "@/components/ui/Choice";
import { SearchField } from "@/components/ui/SearchField";
import { LoadingNote, Skeleton } from "@/components/ui/Skeleton";
import { StateMessage } from "@/components/ui/StateMessage";
import { FlightList, FlightRow } from "@/features/launches/FlightRow";
import { matchesQuery } from "@/features/launches/filters";
import { launchesQuery } from "@/features/launches/queries";
import { savedStore, useSavedSlugs } from "@/features/saved/store";
import { cn } from "@/lib/cn";
import { plural } from "@/lib/format";
import s from "./SavedRoute.module.css";

type SavedSort = "saved" | "az" | "za" | "date";
const SORTS: readonly SavedSort[] = ["saved", "az", "za", "date"];

const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });

function sortSaved(list: LaunchSummary[], sort: SavedSort): LaunchSummary[] {
  switch (sort) {
    case "az":
      return [...list].sort((a, b) => collator.compare(a.mission, b.mission));
    case "za":
      return [...list].sort((a, b) => collator.compare(b.mission, a.mission));
    case "date":
      return [...list].sort((a, b) => b.net.localeCompare(a.net));
    default:
      return list;
  }
}

export default function SavedRoute() {
  const saved = useSavedSlugs();
  const query = useQuery(launchesQuery());
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const deferredQ = useDeferredValue(q);
  const sortParam = params.get("sort");
  const sort: SavedSort = SORTS.includes(sortParam as SavedSort)
    ? (sortParam as SavedSort)
    : "saved";

  const bySlug = useMemo(() => new Map((query.data ?? []).map((l) => [l.slug, l])), [query.data]);
  const known = useMemo(
    () => saved.map((slug) => bySlug.get(slug)).filter((l): l is LaunchSummary => Boolean(l)),
    [saved, bySlug],
  );
  const missing = query.data ? saved.filter((slug) => !bySlug.has(slug)) : [];
  const visible = useMemo(
    () =>
      sortSaved(
        known.filter((l) => matchesQuery(l, deferredQ)),
        sort,
      ),
    [known, deferredQ, sort],
  );

  const setParam = (key: string, value: string, fallback: string, replace = false) => {
    const next = new URLSearchParams(params);
    if (value === fallback) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace, preventScrollReset: true });
  };

  return (
    <div className={cn("page", s.saved)}>
      <PageMeta
        title="Saved flights"
        description="Flights you bookmarked on Downrange, kept in this browser."
      />
      <header className={s.header}>
        <h1>Saved flights</h1>
        <p>Flights you bookmark are kept in this browser only; nothing is sent anywhere.</p>
      </header>

      {saved.length === 0 ? (
        <StateMessage
          variant="empty"
          title="Nothing saved yet"
          body="Use the bookmark on any flight in the log or on its sheet to keep it here."
          action={
            <ButtonLink to="/launches" variant="ink">
              Open the flight log
            </ButtonLink>
          }
        />
      ) : (
        <>
          <div className={s.controls}>
            <SearchField
              id="saved-search"
              label="Search saved flights"
              value={q}
              onChange={(v) => setParam("q", v, "", true)}
              placeholder="Mission, vehicle, orbit…"
              className={s.search}
            />
            <Choice
              legend="Order"
              name="saved-sort"
              value={sort}
              onChange={(v) => setParam("sort", v, "saved")}
              disabled={known.length <= 1}
              options={[
                { value: "saved", label: "Recently saved" },
                { value: "az", label: "A–Z" },
                { value: "za", label: "Z–A" },
                { value: "date", label: "Launch date" },
              ]}
            />
          </div>

          <p role="status" className={s.count}>
            {query.data
              ? `${plural(visible.length, "flight")}${q ? ` matching “${q}”` : ""}`
              : "Loading…"}
          </p>

          {query.isError ? (
            <StateMessage
              variant="error"
              title="Saved flights did not load"
              action={
                <Button variant="ink" onClick={() => query.refetch()}>
                  Try again
                </Button>
              }
            />
          ) : !query.data ? (
            <div aria-busy="true">
              <LoadingNote>Loading saved flights…</LoadingNote>
              {saved.slice(0, 5).map((slug) => (
                <Skeleton key={slug} height={64} style={{ marginBottom: 1 }} />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <StateMessage
              variant="empty"
              title="No saved flight matches"
              body={`Nothing you saved matches “${q}”.`}
            />
          ) : (
            <FlightList>
              {visible.map((l) => (
                <FlightRow key={l.slug} launch={l} />
              ))}
            </FlightList>
          )}

          {missing.length > 0 && (
            <div className={s.missing}>
              <p>
                {plural(missing.length, "saved flight")} {missing.length === 1 ? "is" : "are"} no
                longer in the record (renamed or removed by the data source).
              </p>
              <Button
                variant="line"
                size="sm"
                onClick={() => missing.forEach((slug) => savedStore.remove(slug))}
              >
                Remove {missing.length === 1 ? "it" : "them"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
