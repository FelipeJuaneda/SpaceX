import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import s from "./Select.module.css";

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Select({ id, label, value, onChange, children, className }: Props) {
  return (
    <div className={cn(s.field, className)}>
      <label htmlFor={id} className="legend">
        {label}
      </label>
      <div className={s.control}>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={s.select}
        >
          {children}
        </select>
        <ChevronDown aria-hidden="true" className={s.chevron} size={18} strokeWidth={1.75} />
      </div>
    </div>
  );
}
