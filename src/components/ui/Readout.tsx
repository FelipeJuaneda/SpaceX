import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import s from "./Readout.module.css";

export interface ReadoutItem {
  label: string;
  value: ReactNode;
  /** Secondary line under the value (units, context). */
  hint?: ReactNode;
}

/** Label/value pairs, printed legend on the left, recorded reading on the right. */
export function Readout({ items, className }: { items: ReadoutItem[]; className?: string }) {
  return (
    <dl className={cn(s.readout, className)}>
      {items.map((item) => (
        <div key={item.label} className={s.row}>
          <dt className="legend">{item.label}</dt>
          <dd className={s.value}>
            {item.value}
            {item.hint && <span className={s.hint}>{item.hint}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
