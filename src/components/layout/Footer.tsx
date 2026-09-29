import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { Logotype } from "@/components/brand/Logotype";
import { metaQuery } from "@/features/launches/queries";
import { cn } from "@/lib/cn";
import { formatStamp } from "@/lib/format";
import s from "./Footer.module.css";

export function Footer() {
  const { data: meta } = useQuery(metaQuery());
  return (
    <footer className={s.footer}>
      <div className={cn("page", s.inner)}>
        <div className={s.brand}>
          <Logotype />
          <p className={s.tagline}>The SpaceX flight record, drawn as a strip chart.</p>
        </div>

        <dl className={s.facts}>
          <div>
            <dt className="legend">Record as of</dt>
            <dd className="reading">
              {meta ? <time dateTime={meta.generatedAt}>{formatStamp(meta.generatedAt)}</time> : "—"}
            </dd>
          </div>
          <div>
            <dt className="legend">Data</dt>
            <dd>
              <a href="https://thespacedevs.com/llapi" rel="noreferrer" target="_blank">
                Launch Library 2 by The Space Devs
              </a>
            </dd>
          </div>
          <div>
            <dt className="legend">Code</dt>
            <dd>
              <a href="https://github.com/FelipeJuaneda/SpaceX" rel="noreferrer" target="_blank">
                github.com/FelipeJuaneda/SpaceX
              </a>
            </dd>
          </div>
        </dl>

        <nav aria-label="Footer" className={s.nav}>
          <ul>
            <li>
              <Link to="/launches">Flight log</Link>
            </li>
            <li>
              <Link to="/rockets">Fleet</Link>
            </li>
            <li>
              <Link to="/saved">Saved flights</Link>
            </li>
            <li>
              <Link to="/about">About the data</Link>
            </li>
          </ul>
        </nav>

        <p className={s.disclaimer}>
          Unofficial. Downrange is an independent project by Felipe Juaneda and is not affiliated with,
          endorsed by or connected to Space Exploration Technologies Corp. (SpaceX). Photographs belong
          to their credited authors.
        </p>
      </div>
    </footer>
  );
}
