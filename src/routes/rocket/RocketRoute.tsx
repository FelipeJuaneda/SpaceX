import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router";
import { PageMeta } from "@/components/layout/PageMeta";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Readout } from "@/components/ui/Readout";
import { LoadingNote, Skeleton } from "@/components/ui/Skeleton";
import { StateMessage } from "@/components/ui/StateMessage";
import { FlightList, FlightRow } from "@/features/launches/FlightRow";
import { launchesQuery, rocketsQuery } from "@/features/launches/queries";
import { ScaleChart } from "@/features/rockets/ScaleChart";
import { useI18n } from "@/i18n/useI18n";
import { cn } from "@/lib/cn";
import { formatInt, formatLength, formatMass, formatNet, formatPercent } from "@/lib/format";
import s from "./RocketRoute.module.css";

const REFERENCE = "falcon-9-block-5";

export default function RocketRoute() {
  const { slug = "" } = useParams();
  const { m } = useI18n();
  const t = m.rocket;
  const rocketsQ = useQuery(rocketsQuery());
  const launchesQ = useQuery(launchesQuery());

  if (rocketsQ.isError) {
    return (
      <div className={cn("page", s.rocket)}>
        <StateMessage
          variant="error"
          headingLevel={1}
          title={t.errorTitle}
          action={
            <Button variant="ink" onClick={() => rocketsQ.refetch()}>
              {m.common.tryAgain}
            </Button>
          }
        />
      </div>
    );
  }

  if (!rocketsQ.data) {
    return (
      <div className={cn("page", s.rocket)} aria-busy="true">
        <LoadingNote>{t.loading}</LoadingNote>
        <Skeleton width="50%" height="4rem" />
        <Skeleton width="100%" height="480px" style={{ marginTop: 32 }} />
      </div>
    );
  }

  const rocket = rocketsQ.data.find((r) => r.slug === slug);
  if (!rocket) {
    return (
      <div className={cn("page", s.rocket)}>
        <PageMeta title={t.notFoundMeta} />
        <StateMessage
          variant="empty"
          headingLevel={1}
          title={t.notFoundTitle}
          body={t.notFoundBody}
          action={
            <ButtonLink to="/rockets" variant="ink">
              {t.openFleet}
            </ButtonLink>
          }
        />
      </div>
    );
  }

  const reference = rocketsQ.data.find((r) => r.slug === REFERENCE);
  const compare = reference && reference.slug !== rocket.slug ? [rocket, reference] : [rocket];
  const flights = (launchesQ.data ?? []).filter((l) => l.vehicleSlug === rocket.slug);
  const latest = flights
    .filter((l) => l.outcome !== "upcoming")
    .slice(-8)
    .reverse();
  const r = rocket.record;

  return (
    <div className={cn("page", s.rocket)}>
      <PageMeta
        title={rocket.name}
        description={t.description(rocket.name, formatLength(rocket.length), r.flown)}
      />

      <nav aria-label={m.common.breadcrumb} className={s.crumbs}>
        <Link to="/rockets">{m.nav.fleet}</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{rocket.name}</span>
      </nav>

      <header className={s.header}>
        <h1>{rocket.name}</h1>
        <p className={s.status}>
          <span className={cn(s.badge, rocket.active ? s.active : s.retired)}>
            {rocket.active ? t.active : t.retired}
          </span>
          {rocket.maidenFlight && (
            <span className="reading">
              {t.firstFlightOn(formatNet(rocket.maidenFlight, "day"))}
            </span>
          )}
        </p>
        {rocket.description && <p className={s.description}>{rocket.description}</p>}
      </header>

      <div className={s.grid}>
        <div className={s.chartCol}>
          <ScaleChart rockets={compare} highlight={rocket.slug} />
          {compare.length > 1 && <p className={s.note}>{t.beside}</p>}
        </div>
        <div className={s.dataCol}>
          <h2 className={s.blockTitle}>{t.specs}</h2>
          <Readout
            items={[
              { label: t.height, value: formatLength(rocket.length) },
              { label: t.diameter, value: formatLength(rocket.diameter) },
              {
                label: t.liftoffMass,
                value: rocket.launchMass === null ? "—" : `${formatInt(rocket.launchMass)} t`,
              },
              { label: t.leo, value: formatMass(rocket.leo) },
              { label: t.gto, value: formatMass(rocket.gto) },
              {
                label: t.thrust,
                value: rocket.thrust === null ? "—" : `${formatInt(rocket.thrust)} kN`,
              },
              { label: t.stages, value: rocket.stages ?? "—" },
              { label: t.reusable, value: rocket.reusable ? t.yes : t.no },
            ]}
          />
          <h2 className={s.blockTitle}>{t.record}</h2>
          <Readout
            items={[
              {
                label: t.flights,
                value: formatInt(r.flown),
                hint: r.upcoming ? t.scheduledN(r.upcoming) : undefined,
              },
              {
                label: t.successes,
                value: `${formatInt(r.success)}${r.flown ? ` (${formatPercent(r.success, r.flown)})` : ""}`,
              },
              {
                label: t.failures,
                value: formatInt(r.failure + r.partial),
                hint: r.partial ? t.partialN(r.partial) : undefined,
              },
              {
                label: t.landings,
                value: r.landingsAttempted
                  ? t.ofAttempts(r.landingsSucceeded, r.landingsAttempted)
                  : t.noneAttempted,
              },
              ...(r.first
                ? [
                    {
                      label: t.flying,
                      value: `${formatNet(r.first, "month")} → ${r.last ? formatNet(r.last, "month") : "—"}`,
                    },
                  ]
                : []),
            ]}
          />
          {rocket.wiki && (
            <p className={s.wiki}>
              <a href={rocket.wiki} target="_blank" rel="noreferrer">
                {t.wiki}
                <span className="visually-hidden">{m.common.newTab}</span>
              </a>
            </p>
          )}
        </div>
      </div>

      {latest.length > 0 && (
        <section className={s.flights} aria-labelledby="rocket-flights">
          <h2 id="rocket-flights" className={s.blockTitle}>
            {t.latest(rocket.name)}
          </h2>
          <FlightList>
            {latest.map((l) => (
              <FlightRow key={l.slug} launch={l} />
            ))}
          </FlightList>
          <ButtonLink
            to={`/launches?vehicle=${rocket.slug}&outcome=all`}
            variant="quiet"
            iconEnd={<ArrowRight aria-hidden="true" />}
          >
            {t.allInLog(flights.length)}
          </ButtonLink>
        </section>
      )}
    </div>
  );
}
