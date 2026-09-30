import { Link } from "react-router";
import type { Rocket } from "@/types/domain";
import { useI18n } from "@/i18n/useI18n";
import { formatInt, formatLength, formatMass, formatNet, formatPercent } from "@/lib/format";
import s from "./SpecTable.module.css";

/** The fleet as a table: the accessible, sortable-by-eye twin of the scale chart. */
export function SpecTable({ rockets, caption }: { rockets: Rocket[]; caption: string }) {
  const { m } = useI18n();
  return (
    <div className={s.scroller} role="region" aria-label={caption}>
      <table className={s.table}>
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{m.specs.vehicle}</th>
            <th scope="col">{m.specs.height}</th>
            <th scope="col">{m.specs.diameter}</th>
            <th scope="col">{m.specs.liftoffMass}</th>
            <th scope="col">{m.specs.leo}</th>
            <th scope="col">{m.specs.gto}</th>
            <th scope="col">{m.specs.thrust}</th>
            <th scope="col">{m.specs.flights}</th>
            <th scope="col">{m.specs.success}</th>
            <th scope="col">{m.specs.firstFlight}</th>
          </tr>
        </thead>
        <tbody>
          {rockets.map((r) => (
            <tr key={r.slug}>
              <th scope="row">
                <Link to={`/rockets/${r.slug}`}>{r.name}</Link>
              </th>
              <td>{formatLength(r.length)}</td>
              <td>{formatLength(r.diameter)}</td>
              <td>{r.launchMass === null ? "—" : `${formatInt(r.launchMass)} t`}</td>
              <td>{formatMass(r.leo)}</td>
              <td>{formatMass(r.gto)}</td>
              <td>{r.thrust === null ? "—" : `${formatInt(r.thrust)} kN`}</td>
              <td>{formatInt(r.record.flown)}</td>
              <td>{r.record.flown ? formatPercent(r.record.success, r.record.flown) : "—"}</td>
              <td>{r.record.first ? formatNet(r.record.first, "month") : m.specs.notYetFlown}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
