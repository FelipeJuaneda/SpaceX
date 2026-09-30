import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageMeta } from "@/components/layout/PageMeta";
import { Button } from "@/components/ui/Button";
import { Choice } from "@/components/ui/Choice";
import { LoadingNote, Skeleton } from "@/components/ui/Skeleton";
import { StateMessage } from "@/components/ui/StateMessage";
import { rocketsQuery } from "@/features/launches/queries";
import { ScaleChart } from "@/features/rockets/ScaleChart";
import { SpecTable } from "@/features/rockets/SpecTable";
import { useI18n } from "@/i18n/useI18n";
import { cn } from "@/lib/cn";
import s from "./FleetRoute.module.css";

/** The configuration that carried each family furthest; shown first so the chart fits a phone. */
const LEADERS = ["falcon-1", "falcon-9-block-5", "falcon-heavy", "starship-v3"];

export default function FleetRoute() {
  const { m } = useI18n();
  const query = useQuery(rocketsQuery());
  const [scope, setScope] = useState<"leaders" | "all">("leaders");
  const rockets = query.data;
  const flown = rockets?.filter((r) => r.record.flown > 0) ?? [];
  const shown = scope === "all" ? flown : flown.filter((r) => LEADERS.includes(r.slug));
  const flights = flown.reduce((n, r) => n + r.record.flown, 0);

  return (
    <div className={cn("page", s.fleet)}>
      <PageMeta title={m.fleet.title} description={m.fleet.description} />
      <header className={s.header}>
        <h1>{m.fleet.heading}</h1>
        <p>
          {rockets ? m.fleet.intro(flown.length, flights) : ""}
          {m.fleet.scale}
        </p>
      </header>

      {query.isError ? (
        <StateMessage
          variant="error"
          title={m.fleet.errorTitle}
          action={
            <Button variant="ink" onClick={() => query.refetch()}>
              {m.common.tryAgain}
            </Button>
          }
        />
      ) : !rockets ? (
        <div aria-busy="true" className={s.skeleton}>
          <LoadingNote>{m.fleet.loading}</LoadingNote>
          {[90, 280, 280, 500].map((h, i) => (
            <Skeleton key={i} width={48} height={h} />
          ))}
        </div>
      ) : (
        <>
          <Choice
            legend={m.fleet.show}
            name="fleet-scope"
            value={scope}
            onChange={setScope}
            options={[
              { value: "leaders", label: m.fleet.onePerFamily },
              { value: "all", label: m.fleet.every, count: flown.length },
            ]}
          />
          <ScaleChart rockets={shown} className={s.chart} />
          <p className={s.note}>{m.fleet.note}</p>

          <section aria-labelledby="specs-title" className={s.specs}>
            <h2 id="specs-title">{m.fleet.specs}</h2>
            <SpecTable rockets={rockets} caption={m.fleet.specsCaption} />
          </section>
        </>
      )}
    </div>
  );
}
