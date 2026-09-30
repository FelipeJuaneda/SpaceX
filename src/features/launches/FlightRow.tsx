import { UsersRound } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import type { LaunchSummary } from "@/types/domain";
import { LandingGlyph } from "@/components/chart/PenLegend";
import { OutcomeGlyph, OutcomeMark } from "@/components/ui/OutcomeMark";
import { SaveButton } from "@/features/saved/SaveButton";
import { useI18n } from "@/i18n/useI18n";
import { cn } from "@/lib/cn";
import { formatStamp } from "@/lib/format";
import s from "./FlightRow.module.css";

function Recovery({ launch }: { launch: LaunchSummary }) {
  const { m } = useI18n();
  const { attempted, landed } = launch.landings;
  if (launch.outcome === "upcoming") return <span className={s.none} aria-hidden="true" />;
  if (attempted === 0) {
    return (
      <span className={s.expended}>{launch.family === "falcon-1" ? "—" : m.row.expended}</span>
    );
  }
  return (
    <span className={s.landings}>
      {Array.from({ length: attempted }, (_, i) => (
        <LandingGlyph key={i} landed={i < landed} />
      ))}
      <span className={s.landingText}>
        {landed === attempted
          ? attempted > 1
            ? m.row.allLanded(landed)
            : m.row.landed
          : m.row.someLanded(landed, attempted)}
      </span>
    </span>
  );
}

/** The list that holds flight rows; rows adapt to its width, not the viewport's. */
export function FlightList({ children }: { children: ReactNode }) {
  return <ol className={s.list}>{children}</ol>;
}

/** One flight on the roll: its tick, number, date, mission, recovery and outcome. */
export function FlightRow({ launch }: { launch: LaunchSummary }) {
  const { m } = useI18n();
  return (
    <li className={cn(s.row, s[launch.outcome])}>
      <span className={s.tick} aria-hidden="true">
        <OutcomeGlyph outcome={launch.outcome} />
      </span>
      <span className={cn("reading", s.flight)}>
        {launch.flight ? (
          <>
            <span className="visually-hidden">{m.row.flight}</span>
            <span aria-hidden="true">#</span>
            {launch.flight}
          </>
        ) : (
          <span className={s.scheduled}>{m.row.net}</span>
        )}
      </span>
      <time className={cn("reading", s.date)} dateTime={launch.net}>
        {formatStamp(launch.net, launch.precision)}
      </time>
      <div className={s.main}>
        <Link to={`/launches/${launch.slug}`} className={s.link}>
          {launch.mission}
        </Link>
        <span className={s.meta}>
          {launch.vehicle}
          <span aria-hidden="true"> · </span>
          <span className="visually-hidden">, </span>
          {launch.site}
          {launch.orbit && (
            <>
              <span aria-hidden="true"> · </span>
              <span className="visually-hidden">{m.row.orbit}</span>
              {launch.orbit}
            </>
          )}
          {launch.crewed && (
            <span className={s.crew}>
              <UsersRound aria-hidden="true" size={14} strokeWidth={2} />
              {m.row.crew}
            </span>
          )}
        </span>
      </div>
      <span className={s.recovery}>
        <Recovery launch={launch} />
      </span>
      <OutcomeMark outcome={launch.outcome} className={s.outcome} />
      <SaveButton slug={launch.slug} mission={launch.mission} variant="icon" className={s.save} />
    </li>
  );
}
