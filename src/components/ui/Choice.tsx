import { cn } from "@/lib/cn";
import { formatInt } from "@/lib/format";
import s from "./Choice.module.css";

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface Props<T extends string> {
  legend: string;
  name: string;
  options: readonly ChoiceOption<T>[];
  value: T;
  onChange: (value: T) => void;
  hideLegend?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * A row of instrument keys backed by native radio buttons, so arrow keys,
 * form semantics and screen readers work without extra ARIA.
 */
export function Choice<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  hideLegend,
  disabled,
  className,
}: Props<T>) {
  return (
    <fieldset className={cn(s.group, className)} disabled={disabled}>
      <legend className={cn("legend", s.legend, hideLegend && "visually-hidden")}>{legend}</legend>
      <div className={s.keys}>
        {options.map((o) => (
          <label key={o.value} className={s.key}>
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className={s.input}
            />
            <span className={s.face}>
              {o.label}
              {o.count !== undefined && <span className={s.count}>{formatInt(o.count)}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
