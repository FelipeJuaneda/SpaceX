import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { PenLegend } from "@/components/chart/PenLegend";
import { PageMeta } from "@/components/layout/PageMeta";
import { Readout } from "@/components/ui/Readout";
import { metaQuery } from "@/features/launches/queries";
import { useI18n } from "@/i18n/useI18n";
import { cn } from "@/lib/cn";
import { formatInt, formatStamp } from "@/lib/format";
import s from "./AboutRoute.module.css";

export default function AboutRoute() {
  const { data: meta } = useQuery(metaQuery());
  const { m } = useI18n();
  const a = m.about;

  return (
    <article className={cn("page", s.about)}>
      <PageMeta title={a.title} description={a.description} />
      <header className={s.header}>
        <h1>{a.title}</h1>
        <p className={s.lede}>{a.lede}</p>
      </header>

      <div className={s.body}>
        <section aria-labelledby="source-title">
          <h2 id="source-title">{a.sourceTitle}</h2>
          <p>
            {a.source1a}
            <a href="https://thespacedevs.com/llapi" target="_blank" rel="noreferrer">
              {a.source1link}
            </a>
            {a.source1b}
          </p>
          <p>{a.source2}</p>
          {meta && (
            <Readout
              className={s.readout}
              items={[
                { label: a.recordAsOf, value: formatStamp(meta.generatedAt) },
                {
                  label: a.flights,
                  value: a.flightsValue(meta.counts.flown, meta.counts.upcoming),
                },
                { label: a.configurations, value: formatInt(meta.counts.rockets) },
                { label: a.sourceLabel, value: meta.source.name },
              ]}
            />
          )}
        </section>

        <section aria-labelledby="reading-title">
          <h2 id="reading-title">{a.readingTitle}</h2>
          <p>{a.reading}</p>
          <PenLegend className={s.legend} />
          <ul className={s.list}>
            <li>
              <strong>{a.numbersTerm}</strong>
              {a.numbers}
            </li>
            <li>
              <strong>{a.outcomesTerm}</strong>
              {a.outcomes}
            </li>
            <li>
              <strong>{a.landingsTerm}</strong>
              {a.landings}
            </li>
            <li>
              <strong>{a.datesTerm}</strong>
              {a.dates}
            </li>
            <li>
              <strong>{a.languageTerm}</strong>
              {a.language}
            </li>
          </ul>
        </section>

        <section aria-labelledby="limits-title">
          <h2 id="limits-title">{a.limitsTitle}</h2>
          <ul className={s.list}>
            <li>{a.limit1}</li>
            <li>{a.limit2}</li>
            <li>{a.limit3}</li>
          </ul>
        </section>

        <section aria-labelledby="colophon-title">
          <h2 id="colophon-title">{a.colophonTitle}</h2>
          <p>
            {a.colophon1}
            <a href="https://github.com/FelipeJuaneda/SpaceX" target="_blank" rel="noreferrer">
              GitHub
            </a>
            {a.colophon2}
          </p>
          <p>
            <Link to="/launches">{a.openLog}</Link>
          </p>
        </section>
      </div>
    </article>
  );
}
