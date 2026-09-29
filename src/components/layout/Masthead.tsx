import { Link, NavLink } from "react-router";
import { Logotype } from "@/components/brand/Logotype";
import { PenLegend } from "@/components/chart/PenLegend";
import { useSavedSlugs } from "@/features/saved/store";
import { cn } from "@/lib/cn";
import s from "./Masthead.module.css";

const NAV = [
  { to: "/launches", label: "Flight log", short: "Log" },
  { to: "/rockets", label: "Fleet", short: "Fleet" },
  { to: "/saved", label: "Saved", short: "Saved" },
  { to: "/about", label: "About", short: "About" },
] as const;

export function Masthead() {
  const saved = useSavedSlugs().length;
  return (
    <header className={s.masthead}>
      <div className={cn("page", s.inner)}>
        <Link to="/" className={s.home} aria-label="Downrange, home">
          <Logotype />
        </Link>
        <nav aria-label="Primary" className={s.nav}>
          <ul className={s.list}>
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={s.link}>
                  <span className={s.long}>{item.label}</span>
                  <span className={s.short} aria-hidden="true">
                    {item.short}
                  </span>
                  {item.to === "/saved" && saved > 0 && (
                    <>
                      <span className={s.count} aria-hidden="true">
                        {saved}
                      </span>
                      <span className="visually-hidden">, {saved} flights</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <PenLegend className={s.legend} />
      </div>
    </header>
  );
}
