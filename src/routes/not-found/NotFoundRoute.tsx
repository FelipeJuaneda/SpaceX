import { useLocation } from "react-router";
import { PageMeta } from "@/components/layout/PageMeta";
import { ButtonLink } from "@/components/ui/Button";
import { useI18n } from "@/i18n/useI18n";
import { cn } from "@/lib/cn";
import s from "./NotFoundRoute.module.css";

/** The pen runs off the edge of the paper. */
export default function NotFoundRoute() {
  const { pathname } = useLocation();
  const { m } = useI18n();
  return (
    <div className={cn("page", s.notFound)}>
      <PageMeta title={m.notFound.meta} />
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
      <h1 className={s.title}>{m.notFound.title}</h1>
      <p className={s.body}>
        {m.notFound.before}
        <code>{pathname}</code>
        {m.notFound.after}
      </p>
      <div className={s.actions}>
        <ButtonLink to="/" variant="ink">
          {m.notFound.back}
        </ButtonLink>
        <ButtonLink to="/launches" variant="line">
          {m.notFound.search}
        </ButtonLink>
      </div>
    </div>
  );
}
