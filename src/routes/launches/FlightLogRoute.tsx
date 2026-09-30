import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, X } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { PageMeta } from "@/components/layout/PageMeta";
import { Button } from "@/components/ui/Button";
import { Choice } from "@/components/ui/Choice";
import { SearchField } from "@/components/ui/SearchField";
import { Select } from "@/components/ui/Select";
import { LoadingNote, Skeleton } from "@/components/ui/Skeleton";
import { StateMessage } from "@/components/ui/StateMessage";
import { FlightList, FlightRow } from "@/features/launches/FlightRow";
import {
  FAMILY_LABEL,
  applyFilters,
  defaultSort,
  isFiltered,
  outcomeCounts,
  readFilters,
  toSearchParams,
  type LogFilters,
  type OutcomeFilter,
} from "@/features/launches/filters";
import { launchesQuery } from "@/features/launches/queries";
import { groupByYear } from "@/features/launches/selectors";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useI18n } from "@/i18n/useI18n";
import { cn } from "@/lib/cn";
import type { FamilyId } from "@/types/domain";
import s from "./FlightLogRoute.module.css";

export default function FlightLogRoute() {
  const { m } = useI18n();
  const t = m.log;
  const query = useQuery(launchesQuery());
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => readFilters(params), [params]);
  const deferredQ = useDeferredValue(filters.q);
  const launches = query.data;

  const results = useMemo(
    () => (launches ? applyFilters(launches, { ...filters, q: deferredQ }) : []),
    [launches, filters, deferredQ],
  );
  const groups = useMemo(() => groupByYear(results), [results]);
  const largest = Math.max(1, ...groups.map((g) => g.launches.length));
  const counts = useMemo(() => (launches ? outcomeCounts(launches) : null), [launches]);
  const years = useMemo(
    () =>
      launches ? [...new Set(launches.map((l) => new Date(l.net).getUTCFullYear()))].reverse() : [],
    [launches],
  );
  const vehicleName = filters.vehicle
    ? launches?.find((l) => l.vehicleSlug === filters.vehicle)?.vehicle
    : null;

  // Phones show search first and fold the other filters away; wide screens keep them open.
  const wide = useMediaQuery("(min-width: 1024px)");
  const [mobileOpen, setMobileOpen] = useState(false);
  const filtersOpen = wide || mobileOpen;
  const activeFilters = [
    filters.outcome !== "flown",
    filters.family !== "all",
    filters.year !== null,
    filters.crewed,
    filters.sort !== defaultSort(filters.outcome),
  ].filter(Boolean).length;

  /** Typing replaces the history entry; every other change is a step you can go back from. */
  const update = (patch: Partial<LogFilters>, replace = false) => {
    const next = { ...filters, ...patch };
    if (patch.outcome && !("sort" in patch)) next.sort = defaultSort(patch.outcome);
    setParams(toSearchParams(next), { replace, preventScrollReset: true });
  };

  const outcomeOptions: { value: OutcomeFilter; label: string; count?: number }[] = [
    { value: "flown", label: t.flown, count: counts?.flown },
    { value: "success", label: t.successes, count: counts?.success },
    { value: "failure", label: t.failures, count: counts?.failure },
    { value: "upcoming", label: t.scheduled, count: counts?.upcoming },
    { value: "all", label: t.all, count: counts?.all },
  ];

  return (
    <div className={cn("page", s.log)}>
      <PageMeta title={t.title} description={t.description} />

      <header className={s.header}>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </header>

      <form role="search" className={s.controls} onSubmit={(e) => e.preventDefault()}>
        <SearchField
          id="log-search"
          label={t.search}
          value={filters.q}
          onChange={(q) => update({ q }, true)}
          placeholder={t.placeholder}
          className={s.search}
        />
        <details
          className={s.filters}
          open={filtersOpen}
          onToggle={(e) => {
            if (!wide) setMobileOpen(e.currentTarget.open);
          }}
        >
          <summary className={s.summary}>
            <SlidersHorizontal aria-hidden="true" size={18} strokeWidth={1.75} />
            {t.filters}
            {activeFilters > 0 && <span className={s.active}>{t.active(activeFilters)}</span>}
          </summary>
          <div className={s.filterGrid}>
            <Choice
              legend={t.outcome}
              name="outcome"
              options={outcomeOptions}
              value={filters.outcome}
              onChange={(outcome) => update({ outcome })}
              className={s.outcome}
            />
            <Select
              id="log-family"
              label={t.family}
              value={filters.family}
              onChange={(family) => update({ family: family as FamilyId | "all", vehicle: null })}
            >
              <option value="all">{t.allVehicles}</option>
              {(Object.keys(FAMILY_LABEL) as FamilyId[]).map((f) => (
                <option key={f} value={f}>
                  {FAMILY_LABEL[f]}
                </option>
              ))}
            </Select>
            <Select
              id="log-year"
              label={t.year}
              value={filters.year === null ? "" : String(filters.year)}
              onChange={(y) => update({ year: y ? Number(y) : null })}
            >
              <option value="">{t.everyYear}</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
            <Choice
              legend={t.order}
              name="sort"
              options={[
                { value: "newest", label: t.newest },
                { value: "oldest", label: t.oldest },
              ]}
              value={filters.sort}
              onChange={(sort) => update({ sort })}
            />
            <label className={s.check}>
              <input
                type="checkbox"
                checked={filters.crewed}
                onChange={(e) => update({ crewed: e.target.checked })}
              />
              {t.crewed}
            </label>
          </div>
        </details>
      </form>

      <div className={s.status}>
        <p role="status" className={s.count}>
          {launches ? t.count(results.length) : t.loadingCount}
          {vehicleName && t.onVehicle(vehicleName)}
        </p>
        {filters.vehicle && (
          <Button
            variant="line"
            size="sm"
            icon={<X aria-hidden="true" />}
            onClick={() => update({ vehicle: null })}
          >
            {vehicleName ?? filters.vehicle}
            <span className="visually-hidden">{t.removeVehicle}</span>
          </Button>
        )}
        {isFiltered(filters) && (
          <Button
            variant="quiet"
            size="sm"
            onClick={() => setParams({}, { preventScrollReset: true })}
          >
            {m.common.resetFilters}
          </Button>
        )}
      </div>

      {query.isError ? (
        <StateMessage
          variant="error"
          title={t.errorTitle}
          body={t.errorBody}
          action={
            <Button variant="ink" onClick={() => query.refetch()}>
              {m.common.tryAgain}
            </Button>
          }
        />
      ) : !launches ? (
        <div aria-busy="true">
          <LoadingNote>{t.loading}</LoadingNote>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className={s.skeletonRow}>
              <Skeleton width={48} height={14} />
              <Skeleton width="45%" height={20} />
              <Skeleton width={96} height={14} />
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <StateMessage
          variant="empty"
          title={t.emptyTitle}
          body={filters.q ? t.emptyQuery(filters.q) : t.emptyFilters}
          action={
            <Button variant="ink" onClick={() => setParams({}, { preventScrollReset: true })}>
              {m.common.resetFilters}
            </Button>
          }
        />
      ) : (
        groups.map((g) => (
          <section key={g.year} className={s.year} aria-labelledby={`year-${g.year}`}>
            {/* The perforated feed margin of the roll; keeps the year in view while scrolling it. */}
            <div className={s.feed} aria-hidden="true">
              <span className={s.feedYear}>{g.year}</span>
            </div>
            <div className={s.yearBody}>
              <h2 id={`year-${g.year}`} className={s.yearHead}>
                <span className={s.yearNum}>{g.year}</span>
                <span className={s.yearCount}>{t.yearCount(g.launches.length)}</span>
                <span
                  className={s.band}
                  style={{ width: `${(g.launches.length / largest) * 100}%` }}
                  aria-hidden="true"
                />
              </h2>
              <FlightList>
                {g.launches.map((l) => (
                  <FlightRow key={l.slug} launch={l} />
                ))}
              </FlightList>
            </div>
          </section>
        ))
      )}

      {launches && results.length > 0 && (
        <p className={s.end}>{t.end(results.length, launches.length)}</p>
      )}
    </div>
  );
}
