import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { Logotype } from "@/components/brand/Logotype";
import { metaQuery } from "@/features/launches/queries";
import { useI18n } from "@/i18n/useI18n";
import { cn } from "@/lib/cn";
import { formatStamp } from "@/lib/format";
import s from "./Footer.module.css";

export function Footer() {
  const { m } = useI18n();
  const { data: meta } = useQuery(metaQuery());
  return (
    <footer className={s.footer}>
      <div className={cn("page", s.inner)}>
        <div className={s.brand}>
          <Logotype />
          <p className={s.tagline}>{m.footer.tagline}</p>
        </div>

        <dl className={s.facts}>
          <div>
            <dt className="legend">{m.footer.recordAsOf}</dt>
            <dd className="reading">
              {meta ? (
                <time dateTime={meta.generatedAt}>{formatStamp(meta.generatedAt)}</time>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt className="legend">{m.footer.data}</dt>
            <dd>
              <a href="https://thespacedevs.com/llapi" rel="noreferrer" target="_blank">
                Launch Library 2 · The Space Devs
              </a>
            </dd>
          </div>
          <div>
            <dt className="legend">{m.footer.code}</dt>
            <dd>
              <a href="https://github.com/FelipeJuaneda/SpaceX" rel="noreferrer" target="_blank">
                github.com/FelipeJuaneda/SpaceX
              </a>
            </dd>
          </div>
        </dl>

        <nav aria-label={m.footer.label} className={s.nav}>
          <ul>
            <li>
              <Link to="/launches">{m.footer.log}</Link>
            </li>
            <li>
              <Link to="/rockets">{m.footer.fleet}</Link>
            </li>
            <li>
              <Link to="/saved">{m.footer.saved}</Link>
            </li>
            <li>
              <Link to="/about">{m.footer.about}</Link>
            </li>
          </ul>
        </nav>

        <p className={s.disclaimer}>{m.footer.disclaimer}</p>
      </div>
    </footer>
  );
}
