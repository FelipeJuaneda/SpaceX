import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { RecentTrace } from "@/components/chart/RecentTrace";
import { ReuseChart } from "@/components/chart/ReuseChart";
import { RollChart } from "@/components/chart/RollChart";
import { PageMeta } from "@/components/layout/PageMeta";
import { ButtonLink } from "@/components/ui/Button";
import { Readout } from "@/components/ui/Readout";
import { LoadingNote, Skeleton } from "@/components/ui/Skeleton";
import { StateMessage } from "@/components/ui/StateMessage";
import { Button } from "@/components/ui/Button";
import { Countdown } from "@/features/countdown/Countdown";
import { FlightList, FlightRow } from "@/features/launches/FlightRow";
import { launchesQuery, metaQuery, rocketsQuery } from "@/features/launches/queries";
import { isFlown } from "@/features/launches/selectors";
import { useNextLaunch } from "@/features/launches/useNextLaunch";
import { ScaleChart } from "@/features/rockets/ScaleChart";
import { cn } from "@/lib/cn";
import {
  formatDecimal,
  formatInt,
  formatLocal,
  formatNet,
  formatPercent,
  formatStamp,
  isPrecise,
} from "@/lib/format";
import s from "./HomeRoute.module.css";

const FLEET_LEADERS = ["falcon-1", "falcon-9-block-5", "falcon-heavy", "starship-v3"];

export default function HomeRoute() {
  const launchesQ = useQuery(launchesQuery());
  const metaQ = useQuery(metaQuery());
  const rocketsQ = useQuery(rocketsQuery());
  const [now] = useState(() => Date.now());
  const { next, checkingLive } = useNextLaunch(launchesQ.data, now);

  const launches = launchesQ.data;
  const summary = useMemo(() => {
    if (!launches) return null;
    const flown = launches.filter(isFlown);
    return {
      flown,
      upcoming: launches.length - flown.length,
      latest: flown.slice(-6).reverse(),
      scheduled: launches
        .filter((l) => l.outcome === "upcoming" && Date.parse(l.net) > now)
        .slice(0, 6),
    };
  }, [launches, now]);

  if (launchesQ.isError) {
    return (
      <div className="page">
        <PageMeta />
        <StateMessage
          variant="error"
          headingLevel={1}
          title="The record did not load"
          body="The launch snapshot could not be fetched. Check your connection and try again."
          action={
            <Button variant="ink" onClick={() => launchesQ.refetch()}>
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  if (!launches || !summary) return <HomeSkeleton />;

  const records = metaQ.data?.records;
  const leaders = (rocketsQ.data ?? []).filter((r) => FLEET_LEADERS.includes(r.slug));
  const first = summary.flown[0];

  return (
    <>
      <PageMeta />

      <section className={s.head} aria-labelledby="next-title">
        <div className={cn("page", s.headGrid)}>
          <div className={s.next}>
            {next ? (
              <>
                <Countdown
                  net={next.launch.net}
                  precision={next.launch.precision}
                  className={s.countdown}
                />
                <h1 id="next-title" className={s.mission}>
                  <span className="visually-hidden">Next SpaceX launch: </span>
                  {next.launch.mission}
                </h1>
                <p className={s.nextMeta}>
                  <span>{next.launch.vehicle}</span>
                  {next.launch.pad && (
                    <span>
                      {next.launch.pad}, {next.launch.site}
                    </span>
                  )}
                  <span className="reading">
                    <time dateTime={next.launch.net}>
                      {formatStamp(next.launch.net, next.launch.precision)}
                    </time>
                  </span>
                  {isPrecise(next.launch.precision) && (
                    <span className="reading">{formatLocal(next.launch.net)} your time</span>
                  )}
                </p>
                <p className={s.source}>
                  <span className={cn(s.dot, next.live && s.live)} aria-hidden="true" />
                  {next.live
                    ? `${next.launch.status} · timing confirmed live from Launch Library 2`
                    : checkingLive
                      ? "Checking live timing…"
                      : `${next.launch.status} · timing from the daily record`}
                </p>
                <div className={s.actions}>
                  {next.inSnapshot && (
                    <ButtonLink
                      to={`/launches/${next.launch.slug}`}
                      variant="ink"
                      iconEnd={<ArrowRight aria-hidden="true" />}
                    >
                      Open flight sheet
                    </ButtonLink>
                  )}
                  <ButtonLink to="#roll" variant="line" iconEnd={<ArrowDown aria-hidden="true" />}>
                    Read the roll
                  </ButtonLink>
                </div>
              </>
            ) : (
              <h1 id="next-title" className={s.mission}>
                No flight is scheduled in the record
              </h1>
            )}
            <p className={s.lede}>
              Downrange plots every SpaceX flight on one continuous strip chart:{" "}
              <strong>{formatInt(summary.flown.length)} flown</strong> since{" "}
              {first ? formatNet(first.net, "month") : "2006"},{" "}
              <strong>{formatInt(summary.upcoming)} scheduled</strong>.
            </p>
          </div>
          <div className={s.recent}>
            <RecentTrace launches={launches} now={now} />
            {metaQ.data && (
              <p className={cn("legend", s.asOf)}>
                Record as of{" "}
                <time dateTime={metaQ.data.generatedAt}>{formatStamp(metaQ.data.generatedAt)}</time>{" "}
                · Launch Library 2
              </p>
            )}
          </div>
        </div>
      </section>

      <section id="roll" className={s.section} aria-labelledby="roll-title">
        <div className="page">
          <header className={s.sectionHead}>
            <h2 id="roll-title">Two decades on one roll</h2>
            <p>
              Every flight is a tick at its date. The trace above them counts flights in the
              trailing thirty days: a flat line for years, then a climb no launch provider had drawn
              before. Failures are the only red ink.
            </p>
          </header>
          <RollChart launches={launches} now={now} />
        </div>
      </section>

      <section className={s.section} aria-labelledby="reuse-title">
        <div className={cn("page", s.split)}>
          <header className={s.splitText}>
            <h2 id="reuse-title">The boosters that came back</h2>
            {records && (
              <p>
                {formatInt(records.landings.landed)} of {formatInt(records.landings.attempted)}{" "}
                landing attempts recovered the booster (
                {formatPercent(records.landings.landed, records.landings.attempted)}).{" "}
                {formatInt(records.reflights)} flights have flown on a booster that had flown
                before.
              </p>
            )}
            {records && (
              <Readout
                className={s.records}
                items={[
                  ...(records.mostFlownBooster
                    ? [
                        {
                          label: "Most-flown booster",
                          value: (
                            <Link to={`/launches/${records.mostFlownBooster.slug}`}>
                              {records.mostFlownBooster.serial} · {records.mostFlownBooster.flights}{" "}
                              flights
                            </Link>
                          ),
                        },
                      ]
                    : []),
                  ...(records.fastestTurnaround
                    ? [
                        {
                          label: "Fastest turnaround",
                          value: (
                            <Link to={`/launches/${records.fastestTurnaround.slug}`}>
                              {records.fastestTurnaround.serial} ·{" "}
                              {formatDecimal(records.fastestTurnaround.days)} days
                            </Link>
                          ),
                        },
                      ]
                    : []),
                  {
                    label: "Success streak",
                    value: `${formatInt(records.successStreak)} flights in a row`,
                  },
                  {
                    label: "People launched",
                    value: `${formatInt(records.humansFlown)} on ${formatInt(records.crewedFlights)} crewed flights`,
                  },
                  ...(records.busiestYear
                    ? [
                        {
                          label: "Busiest year",
                          value: (
                            <Link to={`/launches?year=${records.busiestYear.year}`}>
                              {records.busiestYear.year} · {formatInt(records.busiestYear.flights)}{" "}
                              flights
                            </Link>
                          ),
                        },
                      ]
                    : []),
                ]}
              />
            )}
          </header>
          <div className={s.splitChart}>
            <ReuseChart launches={launches} />
          </div>
        </div>
      </section>

      {leaders.length > 0 && (
        <section className={s.section} aria-labelledby="fleet-title">
          <div className="page">
            <header className={s.sectionHead}>
              <h2 id="fleet-title">Every vehicle, to scale</h2>
              <p>
                One major division of this paper is ten metres. Falcon 1 would reach the fourth line
                up the side of Starship&apos;s booster.
              </p>
            </header>
            <ScaleChart rockets={leaders} />
            <ButtonLink to="/rockets" variant="line" iconEnd={<ArrowRight aria-hidden="true" />}>
              Open the fleet
            </ButtonLink>
          </div>
        </section>
      )}

      <section className={s.section} aria-labelledby="latest-title">
        <div className={cn("page", s.lists)}>
          <div>
            <h2 id="latest-title" className={s.listTitle}>
              Latest flights
            </h2>
            <FlightList>
              {summary.latest.map((l) => (
                <FlightRow key={l.slug} launch={l} />
              ))}
            </FlightList>
            <ButtonLink
              to="/launches"
              variant="quiet"
              iconEnd={<ArrowRight aria-hidden="true" />}
              className={s.more}
            >
              The whole flight log
            </ButtonLink>
          </div>
          <div>
            <h2 className={s.listTitle}>Scheduled next</h2>
            <FlightList>
              {summary.scheduled.map((l) => (
                <FlightRow key={l.slug} launch={l} />
              ))}
            </FlightList>
            <ButtonLink
              to="/launches?outcome=upcoming"
              variant="quiet"
              iconEnd={<ArrowRight aria-hidden="true" />}
              className={s.more}
            >
              All {formatInt(summary.upcoming)} scheduled flights
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

function HomeSkeleton() {
  return (
    <section className={s.head} aria-busy="true">
      <LoadingNote>Loading the flight record…</LoadingNote>
      <div className={cn("page", s.headGrid)}>
        <div className={s.next}>
          <Skeleton height="clamp(3.5rem, 0.9rem + 11.5vw, 8rem)" width="min(100%, 38rem)" />
          <Skeleton height="3rem" width="60%" style={{ marginTop: 24 }} />
          <Skeleton height="1rem" width="80%" style={{ marginTop: 16 }} />
          <Skeleton height="44px" width="220px" style={{ marginTop: 32 }} />
        </div>
        <div className={s.recent}>
          <Skeleton height="200px" width="100%" />
        </div>
      </div>
    </section>
  );
}
