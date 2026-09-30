import { cn } from "@/lib/cn";
import type { Locale } from "./store";
import { useI18n } from "./useI18n";
import s from "./LanguageSwitch.module.css";

const OPTIONS: { value: Locale; label: string; name: string }[] = [
  { value: "en", label: "EN", name: "English" },
  { value: "es", label: "ES", name: "Español" },
];

/** Two instrument keys; each announces the language in its own name. */
export function LanguageSwitch({ className }: { className?: string }) {
  const { locale, m, setLocale } = useI18n();
  return (
    <div role="group" aria-label={m.nav.language} className={cn(s.switch, className)}>
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          lang={o.value}
          aria-pressed={locale === o.value}
          aria-label={o.name}
          onClick={() => setLocale(o.value)}
          className={s.key}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
