import { useLocation } from "react-router";
import { PageMeta } from "@/components/layout/PageMeta";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import s from "./NotFoundRoute.module.css";

/** The pen runs off the edge of the paper. */
export default function NotFoundRoute() {
  const { pathname } = useLocation();
  return (
    <div className={cn("page", s.notFound)}>
      <PageMeta title="Off the chart" />
      <svg
        className={s.trace}
        viewBox="0 0 600 120"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M0 80H180L188 80L196 40L204 96L212 64L220 80H340L352 80L372 20L392 110L420 2L440 -40" />
      </svg>
      <p className={s.code}>404</p>
      <h1 className={s.title}>This page is off the chart</h1>
      <p className={s.body}>
        Nothing is plotted at <code>{pathname}</code>. The link may be mistyped, or the page may
        have moved when the site was redrawn.
      </p>
      <div className={s.actions}>
        <ButtonLink to="/" variant="ink">
          Back to the head of the roll
        </ButtonLink>
        <ButtonLink to="/launches" variant="line">
          Search the flight log
        </ButtonLink>
      </div>
    </div>
  );
}
