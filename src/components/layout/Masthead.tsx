import { Link, NavLink } from "react-router";
import { Logotype } from "@/components/brand/Logotype";
import { PenLegend } from "@/components/chart/PenLegend";
import { useSavedSlugs } from "@/features/saved/store";
import { LanguageSwitch } from "@/i18n/LanguageSwitch";
import { useI18n } from "@/i18n/useI18n";
import { cn } from "@/lib/cn";
import s from "./Masthead.module.css";

export function Masthead() {
  const { m } = useI18n();
  const saved = useSavedSlugs().length;
  const nav = [
    { to: "/launches", label: m.nav.log, short: m.nav.logShort },
    { to: "/rockets", label: m.nav.fleet, short: m.nav.fleet },
    { to: "/saved", label: m.nav.saved, short: m.nav.saved },
    { to: "/about", label: m.nav.about, short: m.nav.aboutShort },
  ];

  return (
    <header className={s.masthead}>
      <div className={cn("page", s.inner)}>
        <Link to="/" className={s.home} aria-label={m.nav.home}>
          <Logotype />
        </Link>
        <nav aria-label={m.nav.primary} className={s.nav}>
          <ul className={s.list}>
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={s.link}>
                  <span className={s.long}>{item.label}</span>
                  {/* Only one label is displayed at a time, so each stays in the accessibility tree. */}
                  <span className={s.short}>{item.short}</span>
                  {item.to === "/saved" && saved > 0 && (
                    <>
                      <span className={s.count} aria-hidden="true">
                        {saved}
                      </span>
                      <span className="visually-hidden">{m.nav.savedCount(saved)}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className={s.tools}>
          <PenLegend className={s.legend} />
          <LanguageSwitch />
        </div>
      </div>
    </header>
  );
}
