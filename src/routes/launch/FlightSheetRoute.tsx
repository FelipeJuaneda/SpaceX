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
import type { Messages } from "@/i18n/messages";
import { useI18n } from "@/i18n/useI18n";
import { cn } from "@/lib/cn";
import {
  formatDecimal,
  formatInt,
  formatLocal,
  formatMass,
  formatNet,
  formatStamp,
  isPrecise,
} from "@/lib/format";
import { isNotFound } from "@/services/http";
import s from "./FlightSheetRoute.module.css";

function coordinates(lat: number | null, lon: number | null): string | null {
  if (lat === null || lon === null) return null;
  return `${Math.abs(lat).toFixed(3)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(3)}° ${lon >= 0 ? "E" : "W"}`;
}

type SheetText = Messages["sheet"];

function landingText(stage: Stage, upcoming: boolean, t: SheetText): string {
  const landing = stage.landing;
  if (!landing || !landing.attempted) return upcoming ? t.noLandingPlanned : t.expendedNoAttempt;
  const result = upcoming
    ? t.planned
    : landing.success === null
      ? t.notRecorded
      : landing.success
        ? t.landed
        : t.lost;
  return [result, landing.type, landing.location].filter(Boolean).join(" · ");
}

function stageItems(stages: Stage[], upcoming: boolean, t: SheetText): ReadoutItem[] {
  return stages.flatMap((stage, i) => {
    const name = stage.serial ? `${stage.type} ${stage.serial}` : stage.type;
    const history = [
      stage.boosterFlight ? t.nthFlight(stage.boosterFlight) : null,
      stage.turnaroundDays ? t.sinceLast(formatDecimal(stage.turnaroundDays)) : null,
    ]
      .filter(Boolean)
      .join(" · ");
    return [
      {
        label: stages.length > 1 ? t.boosterN(i + 1) : t.booster,
        value: name,
        hint: history || (stage.reused ? t.flightProven : t.firstFlight),
      },
      {
        label: t.recovery,
        value: (
          <span className={s.recovery}>
            {stage.landing?.attempted && !upcoming && (
              <LandingGlyph landed={Boolean(stage.landing.success)} />
            )}
            {landingText(stage, upcoming, t)}
          </span>
        ),
        hint: stage.landing?.description ?? undefined,
      },
    ];
  });
}

export default function FlightSheetRoute() {
  const { slug = "" } = useParams();
  const { m } = useI18n();
  const t = m.sheet;
  const query = useQuery(launchQuery(slug));

  if (query.isPending) return <SheetSkeleton />;

  if (query.isError) {
    return (
      <div className={cn("page", s.sheet)}>
        {isNotFound(query.error) ? (
          <>
            <PageMeta title={t.notFoundMeta} />
            <StateMessage
              variant="empty"
              headingLevel={1}
              title={t.notFoundTitle}
              body={t.notFoundBody}
              action={
                <ButtonLink
                  to={`/launches?q=${encodeURIComponent(slug.replace(/-/g, " "))}&outcome=all`}
                  variant="ink"
                >
                  {t.searchLog}
                </ButtonLink>
              }
            />
          </>
        ) : (
          <>
            <PageMeta title={t.errorMeta} />
            <StateMessage
              variant="error"
              headingLevel={1}
              title={t.errorTitle}
              body={t.errorBody}
              action={
                <Button variant="ink" onClick={() => query.refetch()}>
                  {m.common.tryAgain}
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
  const { m } = useI18n();
  const t = m.sheet;
  const upcoming = l.outcome === "upcoming";
  const year = new Date(l.net).getUTCFullYear();
  const crew = l.spacecraft.flatMap((sc) => sc.crew.map((c) => ({ ...c, craft: sc.name })));
  const operators = [...new Set(l.payloads.map((p) => p.operator).filter(Boolean))];
  const patch = l.patches[0];

  const missionItems: ReadoutItem[] = [
    ...(l.missionType ? [{ label: t.missionType, value: l.missionType }] : []),
    ...(l.orbitName
      ? [{ label: t.targetOrbit, value: l.orbit ? `${l.orbitName} (${l.orbit})` : l.orbitName }]
      : []),
    ...(operators.length ? [{ label: t.operator, value: operators.join(", ") }] : []),
    ...(l.yearCount && !upcoming
      ? [{ label: t.flightOfYearLabel, value: t.flightOfYear(l.yearCount, year) }]
      : []),
  ];

  const padItems: ReadoutItem[] = [
    { label: t.pad, value: l.pad },
    { label: t.site, value: l.location.name },
    ...(coordinates(l.location.lat, l.location.lon)
      ? [{ label: t.coordinates, value: coordinates(l.location.lat, l.location.lon) }]
      : []),
    ...(l.window.start && l.window.end && l.window.start !== l.window.end && isPrecise(l.precision)
      ? [
          {
            label: t.window,
            value: `${formatStamp(l.window.start)} → ${formatStamp(l.window.end).slice(11)}`,
          },
        ]
      : []),
    ...(upcoming && l.probability !== null
      ? [{ label: t.weatherGo, value: `${l.probability}%` }]
      : []),
    ...(upcoming && l.weather ? [{ label: t.weatherConcerns, value: l.weather }] : []),
  ];

  return (
    <article className={cn("page", s.sheet)}>
      <PageMeta
        title={l.mission}
        description={t.description(
          m.outcome[l.outcome],
          l.mission,
          l.vehicle,
          l.pad,
          formatNet(l.net, l.precision),
        )}
      />

      <nav aria-label={m.common.breadcrumb} className={s.crumbs}>
        <ol>
          <li>
            <Link to="/launches">{m.log.title}</Link>
          </li>
          <li>
            <Link to={`/launches?year=${year}`}>{year}</Link>
          </li>
          <li aria-current="page">{l.flight ? t.flightN(l.flight) : t.scheduled}</li>
        </ol>
      </nav>

      <header className={s.header}>
        <div className={s.headText}>
          <div className={s.stamp}>
            {upcoming ? (
              <Countdown net={l.net} precision={l.precision} />
            ) : (
              <p className={s.flightNo}>
                <span className={s.flightLabel}>{t.flight}</span>
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
              <dt className="legend">{upcoming ? t.targetT0 : t.t0}</dt>
              <dd className="reading">
                <time dateTime={l.net}>{formatStamp(l.net, l.precision)}</time>
              </dd>
            </div>
            {isPrecise(l.precision) && (
              <div>
                <dt className="legend">{t.yourTime}</dt>
                <dd className="reading">{formatLocal(l.net)}</dd>
              </div>
            )}
            {upcoming && (
              <div>
                <dt className="legend">{t.status}</dt>
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
                {upcoming ? t.webcast : t.watch}
              </ButtonAnchor>
            )}
          </div>
        </div>

        <div className={s.media}>
          <Photo image={l.image} alt={t.photoAlt(l.vehicle, l.mission)} ratio="4 / 5" priority />
          {patch && (
            <img
              src={patch.url}
              alt={t.patch(patch.name)}
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
            <OutcomeGlyph outcome={l.outcome} /> {t.whatWentWrong}
          </h2>
          <p>{l.failReason}</p>
        </section>
      )}

      {l.timeline.length > 1 && (
        <section className={s.block} aria-labelledby="sequence-title">
          <h2 id="sequence-title" className={s.blockTitle}>
            {t.sequence}
          </h2>
          <SequenceTrace events={l.timeline} planned={upcoming} />
        </section>
      )}

      <div className={s.columns}>
        <section aria-labelledby="mission-title" className={s.column}>
          <h2 id="mission-title" className={s.blockTitle}>
            {t.mission}
          </h2>
          {l.description && <p className={s.description}>{l.description}</p>}
          {missionItems.length > 0 && <Readout items={missionItems} />}
          {l.payloads.length > 0 && (
            <Readout
              className={s.gap}
              items={l.payloads.map((p) => ({
                label: p.type ?? t.payload,
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
            {t.vehicleTitle}
          </h2>
          <Readout
            items={[
              {
                label: t.vehicle,
                value: l.vehicleSlug ? (
                  <Link to={`/rockets/${l.vehicleSlug}`}>{l.vehicle}</Link>
                ) : (
                  l.vehicle
                ),
              },
              ...stageItems(l.stages, upcoming, t),
              ...l.spacecraft.map((sc) => ({
                label: t.spacecraft,
                value:
                  sc.serial && !sc.name.includes(sc.serial) ? `${sc.name} (${sc.serial})` : sc.name,
                hint: sc.destination ?? undefined,
              })),
            ]}
          />
          {crew.length > 0 && (
            <>
              <h3 className={s.subTitle}>{t.crew}</h3>
              <ul className={s.crew}>
                {crew.map((c) => (
                  <li key={`${c.craft}-${c.name}`}>
                    <span className={s.crewName}>{c.name}</span>
                    <span className={s.crewRole}>
                      {c.name === "Starman"
                        ? t.starman
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
            {t.padTitle}
          </h2>
          <Readout items={padItems} />
          {(l.links.length > 0 || l.videos.length > 0) && (
            <>
              <h3 className={s.subTitle}>{t.further}</h3>
              <ul className={s.links}>
                {[...l.videos, ...l.links].map((link) => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noreferrer">
                      {link.title.trim() || link.source || link.url}
                      <ExternalLink aria-hidden="true" size={14} />
                      <span className="visually-hidden">{m.common.newTab}</span>
                    </a>
                    {link.source && <span className={s.linkSource}>{link.source}</span>}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

      <nav className={s.pager} aria-label={t.adjacent}>
        {l.prev ? (
          <Link to={`/launches/${l.prev.slug}`} className={s.prev}>
            <span className="legend">
              <ArrowLeft aria-hidden="true" size={14} /> {t.prev}
            </span>
            <span className={s.pagerName}>{l.prev.name}</span>
          </Link>
        ) : (
          <span />
        )}
        {l.next && (
          <Link to={`/launches/${l.next.slug}`} className={s.nextLink}>
            <span className="legend">
              {t.next} <ArrowRight aria-hidden="true" size={14} />
            </span>
            <span className={s.pagerName}>{l.next.name}</span>
          </Link>
        )}
      </nav>

      <p className={s.source}>
        {t.source(l.flight ? `#${formatInt(l.flight)}` : t.scheduledSource)}
      </p>
    </article>
  );
}

function SheetSkeleton() {
  const { m } = useI18n();
  return (
    <div className={cn("page", s.sheet)} aria-busy="true">
      <LoadingNote>{m.sheet.loading}</LoadingNote>
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
