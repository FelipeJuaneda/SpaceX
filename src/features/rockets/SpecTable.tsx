import { Link } from "react-router";
import type { Rocket } from "@/types/domain";
import { formatInt, formatLength, formatMass, formatNet, formatPercent } from "@/lib/format";
import s from "./SpecTable.module.css";

/** The fleet as a table: the accessible, sortable-by-eye twin of the scale chart. */
export function SpecTable({ rockets, caption }: { rockets: Rocket[]; caption: string }) {
  return (
    <div className={s.scroller} role="region" aria-label={caption}>
      <table className={s.table}>
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Vehicle</th>
            <th scope="col">Height</th>
            <th scope="col">Diameter</th>
            <th scope="col">Liftoff mass</th>
            <th scope="col">To LEO</th>
            <th scope="col">To GTO</th>
            <th scope="col">Liftoff thrust</th>
            <th scope="col">Flights</th>
            <th scope="col">Success</th>
            <th scope="col">First flight</th>
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
              <td>{r.record.first ? formatNet(r.record.first, "month") : "Not yet flown"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
