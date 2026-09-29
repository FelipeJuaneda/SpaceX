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
import { cn } from "@/lib/cn";
import { formatInt } from "@/lib/format";
import s from "./FleetRoute.module.css";

/** The configuration that carried each family furthest; shown first so the chart fits a phone. */
const LEADERS = ["falcon-1", "falcon-9-block-5", "falcon-heavy", "starship-v3"];

export default function FleetRoute() {
  const query = useQuery(rocketsQuery());
  const [scope, setScope] = useState<"leaders" | "all">("leaders");
  const rockets = query.data;
  const flown = rockets?.filter((r) => r.record.flown > 0) ?? [];
  const shown = scope === "all" ? flown : flown.filter((r) => LEADERS.includes(r.slug));
  const flights = flown.reduce((n, r) => n + r.record.flown, 0);

  return (
    <div className={cn("page", s.fleet)}>
      <PageMeta
        title="Fleet"
        description="Every SpaceX launch vehicle drawn to the same scale, from Falcon 1 to Starship, with specifications and flight record."
      />
      <header className={s.header}>
        <h1>The fleet, to scale</h1>
        <p>
          {rockets
            ? `${formatInt(flown.length)} vehicle configurations have flown ${formatInt(flights)} SpaceX missions. `
            : ""}
          Every silhouette is drawn at four pixels per metre, so one major division of the paper is
          ten metres.
        </p>
      </header>

      {query.isError ? (
        <StateMessage
          variant="error"
          title="The fleet did not load"
          action={
            <Button variant="ink" onClick={() => query.refetch()}>
              Try again
            </Button>
          }
        />
      ) : !rockets ? (
        <div aria-busy="true" className={s.skeleton}>
          <LoadingNote>Loading the fleet…</LoadingNote>
          {[90, 280, 280, 500].map((h, i) => (
            <Skeleton key={i} width={48} height={h} />
          ))}
        </div>
      ) : (
        <>
          <Choice
            legend="Show"
            name="fleet-scope"
            value={scope}
            onChange={setScope}
            options={[
              { value: "leaders", label: "One per family" },
              { value: "all", label: "Every configuration", count: flown.length },
            ]}
          />
          <ScaleChart rockets={shown} className={s.chart} />
          <p className={s.note}>
            Schematic silhouettes. Height and diameter are recorded values; stage, fairing and fin
            proportions are approximate.
          </p>

          <section aria-labelledby="specs-title" className={s.specs}>
            <h2 id="specs-title">Specifications and record</h2>
            <SpecTable
              rockets={rockets}
              caption="Specifications and flight record of every SpaceX vehicle configuration"
            />
          </section>
        </>
      )}
    </div>
  );
}
