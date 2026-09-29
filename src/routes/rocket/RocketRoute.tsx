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
import { cn } from "@/lib/cn";
import { formatInt, formatLength, formatMass, formatNet, formatPercent, plural } from "@/lib/format";
import s from "./RocketRoute.module.css";

const REFERENCE = "falcon-9-block-5";

export default function RocketRoute() {
  const { slug = "" } = useParams();
  const rocketsQ = useQuery(rocketsQuery());
  const launchesQ = useQuery(launchesQuery());

  if (rocketsQ.isError) {
    return (
      <div className={cn("page", s.rocket)}>
        <StateMessage
          variant="error"
          headingLevel={1}
          title="This vehicle did not load"
          action={
            <Button variant="ink" onClick={() => rocketsQ.refetch()}>
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  if (!rocketsQ.data) {
    return (
      <div className={cn("page", s.rocket)} aria-busy="true">
        <LoadingNote>Loading the vehicle…</LoadingNote>
        <Skeleton width="50%" height="4rem" />
        <Skeleton width="100%" height="480px" style={{ marginTop: 32 }} />
      </div>
    );
  }

  const rocket = rocketsQ.data.find((r) => r.slug === slug);
  if (!rocket) {
    return (
      <div className={cn("page", s.rocket)}>
        <PageMeta title="Vehicle not found" />
        <StateMessage
          variant="empty"
          headingLevel={1}
          title="No vehicle by that name"
          body="The record has no vehicle configuration at this address."
          action={
            <ButtonLink to="/rockets" variant="ink">
              Open the fleet
            </ButtonLink>
          }
        />
      </div>
    );
  }

  const reference = rocketsQ.data.find((r) => r.slug === REFERENCE);
  const compare = reference && reference.slug !== rocket.slug ? [rocket, reference] : [rocket];
  const flights = (launchesQ.data ?? []).filter((l) => l.vehicleSlug === rocket.slug);
  const latest = flights.filter((l) => l.outcome !== "upcoming").slice(-8).reverse();
  const r = rocket.record;

  return (
    <div className={cn("page", s.rocket)}>
      <PageMeta
        title={rocket.name}
        description={`${rocket.name}: ${formatLength(rocket.length)} tall, ${plural(r.flown, "flight")}. Specifications and flight record.`}
      />

      <nav aria-label="Breadcrumb" className={s.crumbs}>
        <Link to="/rockets">Fleet</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{rocket.name}</span>
      </nav>

      <header className={s.header}>
        <h1>{rocket.name}</h1>
        <p className={s.status}>
          <span className={cn(s.badge, rocket.active ? s.active : s.retired)}>{rocket.active ? "Active" : "Retired"}</span>
          {rocket.maidenFlight && <span className="reading">First flight {formatNet(rocket.maidenFlight, "day")}</span>}
        </p>
        {rocket.description && <p className={s.description}>{rocket.description}</p>}
      </header>

      <div className={s.grid}>
        <div className={s.chartCol}>
          <ScaleChart rockets={compare} highlight={rocket.slug} />
          {compare.length > 1 && <p className={s.note}>Shown beside Falcon 9 Block 5 for scale.</p>}
        </div>
        <div className={s.dataCol}>
          <h2 className={s.blockTitle}>Specifications</h2>
          <Readout
            items={[
              { label: "Height", value: formatLength(rocket.length) },
              { label: "Diameter", value: formatLength(rocket.diameter) },
              { label: "Liftoff mass", value: rocket.launchMass === null ? "—" : `${formatInt(rocket.launchMass)} t` },
              { label: "Payload to LEO", value: formatMass(rocket.leo) },
              { label: "Payload to GTO", value: formatMass(rocket.gto) },
              { label: "Liftoff thrust", value: rocket.thrust === null ? "—" : `${formatInt(rocket.thrust)} kN` },
              { label: "Stages", value: rocket.stages ?? "—" },
              { label: "Reusable", value: rocket.reusable ? "Yes" : "No" },
            ]}
          />
          <h2 className={s.blockTitle}>Record</h2>
          <Readout
            items={[
              { label: "Flights", value: formatInt(r.flown), hint: r.upcoming ? `${formatInt(r.upcoming)} scheduled` : undefined },
              {
                label: "Successes",
                value: `${formatInt(r.success)}${r.flown ? ` (${formatPercent(r.success, r.flown)})` : ""}`,
              },
              { label: "Failures", value: formatInt(r.failure + r.partial), hint: r.partial ? `${r.partial} partial` : undefined },
              {
                label: "Booster landings",
                value: r.landingsAttempted
                  ? `${formatInt(r.landingsSucceeded)} of ${formatInt(r.landingsAttempted)} attempts`
                  : "None attempted",
              },
              ...(r.first ? [{ label: "Flying", value: `${formatNet(r.first, "month")} → ${r.last ? formatNet(r.last, "month") : "—"}` }] : []),
            ]}
          />
          {rocket.wiki && (
            <p className={s.wiki}>
              <a href={rocket.wiki} target="_blank" rel="noreferrer">
                Read more on Wikipedia<span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </p>
          )}
        </div>
      </div>

      {latest.length > 0 && (
        <section className={s.flights} aria-labelledby="rocket-flights">
          <h2 id="rocket-flights" className={s.blockTitle}>
            Latest {rocket.name} flights
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
            All {plural(flights.length, "flight")} in the log
          </ButtonLink>
        </section>
      )}
    </div>
  );
}
