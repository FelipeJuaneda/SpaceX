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
import { useI18n } from "@/i18n/useI18n";
import { cn } from "@/lib/cn";
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
  const { m } = useI18n();
  const t = m.saved;
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
      <PageMeta title={t.title} description={t.description} />
      <header className={s.header}>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </header>

      {saved.length === 0 ? (
        <StateMessage
          variant="empty"
          title={t.emptyTitle}
          body={t.emptyBody}
          action={
            <ButtonLink to="/launches" variant="ink">
              {t.openLog}
            </ButtonLink>
          }
        />
      ) : (
        <>
          <div className={s.controls}>
            <SearchField
              id="saved-search"
              label={t.search}
              value={q}
              onChange={(v) => setParam("q", v, "", true)}
              placeholder={t.placeholder}
              className={s.search}
            />
            <Choice
              legend={t.order}
              name="saved-sort"
              value={sort}
              onChange={(v) => setParam("sort", v, "saved")}
              disabled={known.length <= 1}
              options={[
                { value: "saved", label: t.recent },
                { value: "az", label: t.az },
                { value: "za", label: t.za },
                { value: "date", label: t.date },
              ]}
            />
          </div>

          <p role="status" className={s.count}>
            {query.data ? t.count(visible.length, q) : t.loadingCount}
          </p>

          {query.isError ? (
            <StateMessage
              variant="error"
              title={t.errorTitle}
              action={
                <Button variant="ink" onClick={() => query.refetch()}>
                  {m.common.tryAgain}
                </Button>
              }
            />
          ) : !query.data ? (
            <div aria-busy="true">
              <LoadingNote>{t.loading}</LoadingNote>
              {saved.slice(0, 5).map((slug) => (
                <Skeleton key={slug} height={64} style={{ marginBottom: 1 }} />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <StateMessage variant="empty" title={t.noMatchTitle} body={t.noMatchBody(q)} />
          ) : (
            <FlightList>
              {visible.map((l) => (
                <FlightRow key={l.slug} launch={l} />
              ))}
            </FlightList>
          )}

          {missing.length > 0 && (
            <div className={s.missing}>
              <p>{t.missing(missing.length)}</p>
              <Button
                variant="line"
                size="sm"
                onClick={() => missing.forEach((slug) => savedStore.remove(slug))}
              >
                {t.remove(missing.length)}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
