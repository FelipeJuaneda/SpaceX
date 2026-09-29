import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { PenLegend } from "@/components/chart/PenLegend";
import { PageMeta } from "@/components/layout/PageMeta";
import { Readout } from "@/components/ui/Readout";
import { metaQuery } from "@/features/launches/queries";
import { cn } from "@/lib/cn";
import { formatInt, formatStamp } from "@/lib/format";
import s from "./AboutRoute.module.css";

export default function AboutRoute() {
  const { data: meta } = useQuery(metaQuery());

  return (
    <article className={cn("page", s.about)}>
      <PageMeta
        title="About the data"
        description="Where Downrange's SpaceX launch data comes from, how often it updates, what it can and cannot tell you, and who made it."
      />
      <header className={s.header}>
        <h1>About the data</h1>
        <p className={s.lede}>
          Downrange is an independent explorer of SpaceX&apos;s flight record. It is not made by,
          endorsed by or affiliated with SpaceX.
        </p>
      </header>

      <div className={s.body}>
        <section aria-labelledby="source-title">
          <h2 id="source-title">Where the record comes from</h2>
          <p>
            Every flight, vehicle and figure on this site is computed from{" "}
            <a href="https://thespacedevs.com/llapi" target="_blank" rel="noreferrer">
              Launch Library 2
            </a>
            , the open launch database maintained by The Space Devs. A script downloads the full
            SpaceX record once a day, normalizes it and publishes it with the site as static files,
            so pages load fast and keep working if the source is briefly unavailable.
          </p>
          <p>
            The only live request is for the next launch: its timing is checked against Launch
            Library 2 when you open the home page and falls back to the daily record if that check
            fails. The home page says which one you are seeing.
          </p>
          {meta && (
            <Readout
              className={s.readout}
              items={[
                { label: "Record as of", value: formatStamp(meta.generatedAt) },
                {
                  label: "Flights",
                  value: `${formatInt(meta.counts.flown)} flown · ${formatInt(meta.counts.upcoming)} scheduled`,
                },
                { label: "Vehicle configurations", value: formatInt(meta.counts.rockets) },
                { label: "Source", value: meta.source.name },
              ]}
            />
          )}
        </section>

        <section aria-labelledby="reading-title">
          <h2 id="reading-title">Reading the chart</h2>
          <p>
            The site is drawn like a strip-chart recorder: pens writing on graph paper as it feeds.
            Each ink carries one meaning, and every mark also differs in shape, so nothing depends
            on colour alone.
          </p>
          <PenLegend className={s.legend} />
          <ul className={s.list}>
            <li>
              <strong>Flight numbers</strong> count every SpaceX launch attempt in chronological
              order, including the failures and the Amos-6 pad anomaly the source records as a
              launch.
            </li>
            <li>
              <strong>Outcomes</strong> are the source&apos;s: success, failure, or partial failure
              (the vehicle flew but the payload did not reach its intended orbit).
            </li>
            <li>
              <strong>Booster landings</strong> count first stages and side boosters only; Dragon
              splashdowns are not included.
            </li>
            <li>
              <strong>Dates</strong> are printed only as precisely as the record knows them. A
              flight planned for &ldquo;Q4 2026&rdquo; never gets a fake countdown.
            </li>
          </ul>
        </section>

        <section aria-labelledby="limits-title">
          <h2 id="limits-title">Known limits</h2>
          <ul className={s.list}>
            <li>
              Scheduled dates move constantly; the daily record can lag a slip by up to a day.
            </li>
            <li>
              Some photographs show the vehicle in general rather than the specific flight. Those
              are labelled, and every photograph carries the credit and licence the source provides.
            </li>
            <li>
              This site used to read the community SpaceX API, which went offline in 2026 after
              freezing its data in October 2022. Old links and saved flights from that version are
              redirected to the new record.
            </li>
          </ul>
        </section>

        <section aria-labelledby="colophon-title">
          <h2 id="colophon-title">Colophon</h2>
          <p>
            Designed and built by Felipe Juaneda with React, TypeScript, TanStack Query and Motion.
            Set in Archivo and Martian Mono. The source code is on{" "}
            <a href="https://github.com/FelipeJuaneda/SpaceX" target="_blank" rel="noreferrer">
              GitHub
            </a>
            .
          </p>
          <p>
            <Link to="/launches">Open the flight log</Link>
          </p>
        </section>
      </div>
    </article>
  );
}
