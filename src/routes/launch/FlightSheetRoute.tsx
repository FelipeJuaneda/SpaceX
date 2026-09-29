import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, ExternalLink, Play } from "lucide-react";
import { Link, useParams } from "react-router";
import type { LaunchDetail, Stage } from "@/types/domain";
import { LandingGlyph } from "@/components/chart/PenLegend";
import { SequenceTrace } from "@/components/chart/SequenceTrace";
import { PageMeta } from "@/components/layout/PageMeta";
import { Button, ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { OutcomeGlyph, OutcomeMark } from "@/components/ui/OutcomeMark";
import { Photo } from "@/components/ui/Photo";
import { Readout, type ReadoutItem } from "@/components/ui/Readout";
import { LoadingNote, Skeleton } from "@/components/ui/Skeleton";
import { StateMessage } from "@/components/ui/StateMessage";
import { Countdown } from "@/features/countdown/Countdown";
import { launchQuery } from "@/features/launches/queries";
import { SaveButton } from "@/features/saved/SaveButton";
import { cn } from "@/lib/cn";
import {
  OUTCOME_LABEL,
  formatDecimal,
  formatInt,
  formatLocal,
  formatMass,
  formatNet,
  formatStamp,
  isPrecise,
  ordinal,
} from "@/lib/format";
import { isNotFound } from "@/services/http";
import s from "./FlightSheetRoute.module.css";

function coordinates(lat: number | null, lon: number | null): string | null {
  if (lat === null || lon === null) return null;
  return `${Math.abs(lat).toFixed(3)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(3)}° ${lon >= 0 ? "E" : "W"}`;
}

function landingText(stage: Stage, upcoming: boolean): string {
  const landing = stage.landing;
  if (!landing || !landing.attempted)
    return upcoming ? "No landing planned" : "Expended, no landing attempt";
  const result = upcoming
    ? "Planned"
    : landing.success === null
      ? "Result not recorded"
      : landing.success
        ? "Landed"
        : "Lost";
  return [result, landing.type, landing.location].filter(Boolean).join(" · ");
}

function stageItems(stages: Stage[], upcoming: boolean): ReadoutItem[] {
  return stages.flatMap((stage, i) => {
    const name = stage.serial ? `${stage.type} ${stage.serial}` : stage.type;
    const history = [
      stage.boosterFlight ? `${ordinal(stage.boosterFlight)} flight` : null,
      stage.turnaroundDays ? `${formatDecimal(stage.turnaroundDays)} days since its last` : null,
    ]
      .filter(Boolean)
      .join(" · ");
    return [
      {
        label: stages.length > 1 ? `Booster ${i + 1}` : "Booster",
        value: name,
        hint: history || (stage.reused ? "Flight-proven" : "First flight"),
      },
      {
        label: "Recovery",
        value: (
          <span className={s.recovery}>
            {stage.landing?.attempted && !upcoming && (
              <LandingGlyph landed={Boolean(stage.landing.success)} />
            )}
            {landingText(stage, upcoming)}
          </span>
        ),
        hint: stage.landing?.description ?? undefined,
      },
    ];
  });
}

export default function FlightSheetRoute() {
  const { slug = "" } = useParams();
  const query = useQuery(launchQuery(slug));

  if (query.isPending) return <SheetSkeleton />;

  if (query.isError) {
    return (
      <div className={cn("page", s.sheet)}>
        {isNotFound(query.error) ? (
          <>
            <PageMeta title="Flight not found" />
            <StateMessage
              variant="empty"
              headingLevel={1}
              title="No flight at this address"
              body="The record has no flight sheet for this link. It may have been renamed; the flight log can find it."
              action={
                <ButtonLink
                  to={`/launches?q=${encodeURIComponent(slug.replace(/-/g, " "))}&outcome=all`}
                  variant="ink"
                >
                  Search the flight log
                </ButtonLink>
              }
            />
          </>
        ) : (
          <>
            <PageMeta title="Flight sheet unavailable" />
            <StateMessage
              variant="error"
              headingLevel={1}
              title="This flight sheet did not load"
              body="The request failed. Check your connection and try again."
              action={
                <Button variant="ink" onClick={() => query.refetch()}>
                  Try again
                </Button>
              }
            />
          </>
        )}
      </div>
    );
  }

  return <Sheet launch={query.data} />;
}

function Sheet({ launch: l }: { launch: LaunchDetail }) {
  const upcoming = l.outcome === "upcoming";
  const year = new Date(l.net).getUTCFullYear();
  const crew = l.spacecraft.flatMap((sc) => sc.crew.map((c) => ({ ...c, craft: sc.name })));
  const operators = [...new Set(l.payloads.map((p) => p.operator).filter(Boolean))];
  const patch = l.patches[0];

  const missionItems: ReadoutItem[] = [
    ...(l.missionType ? [{ label: "Mission type", value: l.missionType }] : []),
    ...(l.orbitName
      ? [{ label: "Target orbit", value: l.orbit ? `${l.orbitName} (${l.orbit})` : l.orbitName }]
      : []),
    ...(operators.length ? [{ label: "Payload operator", value: operators.join(", ") }] : []),
    ...(l.yearCount && !upcoming
      ? [{ label: "Flight of the year", value: `${ordinal(l.yearCount)} SpaceX launch of ${year}` }]
      : []),
  ];

  const padItems: ReadoutItem[] = [
    { label: "Pad", value: l.pad },
    { label: "Site", value: l.location.name },
    ...(coordinates(l.location.lat, l.location.lon)
      ? [{ label: "Coordinates", value: coordinates(l.location.lat, l.location.lon) }]
      : []),
    ...(l.window.start && l.window.end && l.window.start !== l.window.end && isPrecise(l.precision)
      ? [
          {
            label: "Launch window",
            value: `${formatStamp(l.window.start)} → ${formatStamp(l.window.end).slice(11)}`,
          },
        ]
      : []),
    ...(upcoming && l.probability !== null
      ? [{ label: "Weather go", value: `${l.probability}%` }]
      : []),
    ...(upcoming && l.weather ? [{ label: "Weather concerns", value: l.weather }] : []),
  ];

  return (
    <article className={cn("page", s.sheet)}>
      <PageMeta
        title={l.mission}
        description={`${OUTCOME_LABEL[l.outcome]}: ${l.mission} on ${l.vehicle} from ${l.pad}, ${formatNet(l.net, l.precision)}.`}
      />

      <nav aria-label="Breadcrumb" className={s.crumbs}>
        <ol>
          <li>
            <Link to="/launches">Flight log</Link>
          </li>
          <li>
            <Link to={`/launches?year=${year}`}>{year}</Link>
          </li>
          <li aria-current="page">{l.flight ? `Flight ${l.flight}` : "Scheduled"}</li>
        </ol>
      </nav>

      <header className={s.header}>
        <div className={s.headText}>
          <div className={s.stamp}>
            {upcoming ? (
              <Countdown net={l.net} precision={l.precision} />
            ) : (
              <p className={s.flightNo}>
                <span className={s.flightLabel}>Flight</span>
                <span className={s.flightValue}>{l.flight}</span>
              </p>
            )}
          </div>
          <OutcomeMark outcome={l.outcome} className={cn(s.outcome, s[l.outcome])} />
          <h1 className={s.title}>{l.mission}</h1>
          <p className={s.subtitle}>
            {l.vehicleSlug ? <Link to={`/rockets/${l.vehicleSlug}`}>{l.vehicle}</Link> : l.vehicle}{" "}
            · {l.pad}, {l.site}
          </p>
          <dl className={s.t0}>
            <div>
              <dt className="legend">{upcoming ? "Target T-0" : "T-0"}</dt>
              <dd className="reading">
                <time dateTime={l.net}>{formatStamp(l.net, l.precision)}</time>
              </dd>
            </div>
            {isPrecise(l.precision) && (
              <div>
                <dt className="legend">Your time</dt>
                <dd className="reading">{formatLocal(l.net)}</dd>
              </div>
            )}
            {upcoming && (
              <div>
                <dt className="legend">Status</dt>
                <dd className="reading">{l.status}</dd>
              </div>
            )}
          </dl>
          <div className={s.actions}>
            <SaveButton slug={l.slug} mission={l.mission} />
            {l.videos[0] && (
              <ButtonAnchor
                href={l.videos[0].url}
                variant="line"
                icon={<Play aria-hidden="true" />}
              >
                {upcoming ? "Webcast" : "Watch the launch"}
              </ButtonAnchor>
            )}
          </div>
        </div>

        <div className={s.media}>
          <Photo image={l.image} alt={`${l.vehicle} for ${l.mission}`} ratio="4 / 5" priority />
          {patch && (
            <img
              src={patch.url}
              alt={`Mission patch: ${patch.name}`}
              className={s.patch}
              width={112}
              height={112}
              loading="lazy"
              decoding="async"
            />
          )}
        </div>
      </header>

      {l.failReason && (l.outcome === "failure" || l.outcome === "partial") && (
        <section className={s.failure} aria-labelledby="failure-title">
          <h2 id="failure-title">
            <OutcomeGlyph outcome={l.outcome} /> What went wrong
          </h2>
          <p>{l.failReason}</p>
        </section>
      )}

      {l.timeline.length > 1 && (
        <section className={s.block} aria-labelledby="sequence-title">
          <h2 id="sequence-title" className={s.blockTitle}>
            T-minus sequence
          </h2>
          <SequenceTrace events={l.timeline} planned={upcoming} />
        </section>
      )}

      <div className={s.columns}>
        <section aria-labelledby="mission-title" className={s.column}>
          <h2 id="mission-title" className={s.blockTitle}>
            Mission
          </h2>
          {l.description && <p className={s.description}>{l.description}</p>}
          {missionItems.length > 0 && <Readout items={missionItems} />}
          {l.payloads.length > 0 && (
            <Readout
              className={s.gap}
              items={l.payloads.map((p) => ({
                label: p.type ?? "Payload",
                value: p.name,
                hint:
                  [p.massKg ? formatMass(p.massKg) : null, p.destination]
                    .filter(Boolean)
                    .join(" · ") || undefined,
              }))}
            />
          )}
        </section>

        <section aria-labelledby="vehicle-title" className={s.column}>
          <h2 id="vehicle-title" className={s.blockTitle}>
            Vehicle and recovery
          </h2>
          <Readout
            items={[
              {
                label: "Vehicle",
                value: l.vehicleSlug ? (
                  <Link to={`/rockets/${l.vehicleSlug}`}>{l.vehicle}</Link>
                ) : (
                  l.vehicle
                ),
              },
              ...stageItems(l.stages, upcoming),
              ...l.spacecraft.map((sc) => ({
                label: "Spacecraft",
                value:
                  sc.serial && !sc.name.includes(sc.serial) ? `${sc.name} (${sc.serial})` : sc.name,
                hint: sc.destination ?? undefined,
              })),
            ]}
          />
          {crew.length > 0 && (
            <>
              <h3 className={s.subTitle}>Crew</h3>
              <ul className={s.crew}>
                {crew.map((c) => (
                  <li key={`${c.craft}-${c.name}`}>
                    <span className={s.crewName}>{c.name}</span>
                    <span className={s.crewRole}>
                      {c.name === "Starman"
                        ? "Mannequin, not a person"
                        : [c.role, c.agency].filter(Boolean).join(" · ")}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section aria-labelledby="pad-title" className={s.column}>
          <h2 id="pad-title" className={s.blockTitle}>
            Pad and window
          </h2>
          <Readout items={padItems} />
          {(l.links.length > 0 || l.videos.length > 0) && (
            <>
              <h3 className={s.subTitle}>Further reading</h3>
              <ul className={s.links}>
                {[...l.videos, ...l.links].map((link) => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noreferrer">
                      {link.title.trim() || link.source || link.url}
                      <ExternalLink aria-hidden="true" size={14} />
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                    {link.source && <span className={s.linkSource}>{link.source}</span>}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

      <nav className={s.pager} aria-label="Adjacent flights on the roll">
        {l.prev ? (
          <Link to={`/launches/${l.prev.slug}`} className={s.prev}>
            <span className="legend">
              <ArrowLeft aria-hidden="true" size={14} /> Previous flight
            </span>
            <span className={s.pagerName}>{l.prev.name}</span>
          </Link>
        ) : (
          <span />
        )}
        {l.next && (
          <Link to={`/launches/${l.next.slug}`} className={s.nextLink}>
            <span className="legend">
              Next flight <ArrowRight aria-hidden="true" size={14} />
            </span>
            <span className={s.pagerName}>{l.next.name}</span>
          </Link>
        )}
      </nav>

      <p className={s.source}>
        Flight {l.flight ? `#${formatInt(l.flight)}` : "(scheduled)"} · record from Launch Library 2
        by The Space Devs.
      </p>
    </article>
  );
}

function SheetSkeleton() {
  return (
    <div className={cn("page", s.sheet)} aria-busy="true">
      <LoadingNote>Loading the flight sheet…</LoadingNote>
      <Skeleton width={180} height={14} />
      <div className={s.header}>
        <div className={s.headText}>
          <Skeleton width="14rem" height="clamp(3.5rem, 0.9rem + 11.5vw, 8rem)" />
          <Skeleton width="70%" height="3rem" style={{ marginTop: 24 }} />
          <Skeleton width="50%" height="1rem" style={{ marginTop: 16 }} />
          <Skeleton width="220px" height="44px" style={{ marginTop: 32 }} />
        </div>
        <div className={s.media}>
          <Skeleton width="100%" height="auto" style={{ aspectRatio: "4 / 5" }} />
        </div>
      </div>
    </div>
  );
}
