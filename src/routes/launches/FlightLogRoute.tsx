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
import { cn } from "@/lib/cn";
import { formatInt, plural } from "@/lib/format";
import type { FamilyId } from "@/types/domain";
import s from "./FlightLogRoute.module.css";

export default function FlightLogRoute() {
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
    { value: "flown", label: "Flown", count: counts?.flown },
    { value: "success", label: "Successes", count: counts?.success },
    { value: "failure", label: "Failures", count: counts?.failure },
    { value: "upcoming", label: "Scheduled", count: counts?.upcoming },
    { value: "all", label: "All", count: counts?.all },
  ];

  return (
    <div className={cn("page", s.log)}>
      <PageMeta
        title="Flight log"
        description="Every SpaceX flight since 2006: search by mission, vehicle or orbit, filter by outcome and year, and open any flight's sheet."
      />

      <header className={s.header}>
        <h1>Flight log</h1>
        <p>
          The whole roll, a year at a time. Search by mission, vehicle, pad, orbit or flight number
          (try “#100” or “crew dragon”).
        </p>
      </header>

      <form role="search" className={s.controls} onSubmit={(e) => e.preventDefault()}>
        <SearchField
          id="log-search"
          label="Search flights"
          value={filters.q}
          onChange={(q) => update({ q }, true)}
          placeholder="Mission, vehicle, orbit, #flight…"
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
            Filters
            {activeFilters > 0 && <span className={s.active}>{activeFilters} active</span>}
          </summary>
          <div className={s.filterGrid}>
            <Choice
              legend="Outcome"
              name="outcome"
              options={outcomeOptions}
              value={filters.outcome}
              onChange={(outcome) => update({ outcome })}
              className={s.outcome}
            />
            <Select
              id="log-family"
              label="Vehicle family"
              value={filters.family}
              onChange={(family) => update({ family: family as FamilyId | "all", vehicle: null })}
            >
              <option value="all">All vehicles</option>
              {(Object.keys(FAMILY_LABEL) as FamilyId[]).map((f) => (
                <option key={f} value={f}>
                  {FAMILY_LABEL[f]}
                </option>
              ))}
            </Select>
            <Select
              id="log-year"
              label="Year"
              value={filters.year === null ? "" : String(filters.year)}
              onChange={(y) => update({ year: y ? Number(y) : null })}
            >
              <option value="">Every year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
            <Choice
              legend="Order"
              name="sort"
              options={[
                { value: "newest", label: "Newest first" },
                { value: "oldest", label: "Oldest first" },
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
              Crewed flights only
            </label>
          </div>
        </details>
      </form>

      <div className={s.status}>
        <p role="status" className={s.count}>
          {launches ? plural(results.length, "flight") : "Loading flights…"}
          {vehicleName && ` on ${vehicleName}`}
        </p>
        {filters.vehicle && (
          <Button
            variant="line"
            size="sm"
            icon={<X aria-hidden="true" />}
            onClick={() => update({ vehicle: null })}
          >
            {vehicleName ?? filters.vehicle}
            <span className="visually-hidden"> — remove vehicle filter</span>
          </Button>
        )}
        {isFiltered(filters) && (
          <Button
            variant="quiet"
            size="sm"
            onClick={() => setParams({}, { preventScrollReset: true })}
          >
            Reset filters
          </Button>
        )}
      </div>

      {query.isError ? (
        <StateMessage
          variant="error"
          title="The flight log did not load"
          body="The launch snapshot could not be fetched."
          action={
            <Button variant="ink" onClick={() => query.refetch()}>
              Try again
            </Button>
          }
        />
      ) : !launches ? (
        <div aria-busy="true">
          <LoadingNote>Loading the flight log…</LoadingNote>
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
          title="Nothing on this stretch of the roll"
          body={
            filters.q
              ? `No flight matches “${filters.q}” with these filters.`
              : "No flight matches this combination of filters."
          }
          action={
            <Button variant="ink" onClick={() => setParams({}, { preventScrollReset: true })}>
              Reset filters
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
                <span className={s.yearCount}>{plural(g.launches.length, "flight")}</span>
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
        <p className={s.end}>
          End of roll · {formatInt(results.length)} of {formatInt(launches.length)} flights shown
        </p>
      )}
    </div>
  );
}
