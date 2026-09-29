import { Search, X } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import s from "./SearchField.module.css";

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hideLabel?: boolean;
  className?: string;
}

export function SearchField({ id, label, value, onChange, placeholder, hideLabel, className }: Props) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className={cn(s.field, className)}>
      <label htmlFor={id} className={cn("legend", s.label, hideLabel && "visually-hidden")}>
        {label}
      </label>
      <div className={s.control}>
        <Search aria-hidden="true" className={s.icon} size={18} strokeWidth={1.75} />
        <input
          ref={input}
          id={id}
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          className={s.input}
        />
        {value && (
          <button
            type="button"
            className={s.clear}
            aria-label="Clear search"
            onClick={() => {
              onChange("");
              input.current?.focus();
            }}
          >
            <X aria-hidden="true" size={18} strokeWidth={1.75} />
          </button>
        )}
      </div>
    </div>
  );
}
