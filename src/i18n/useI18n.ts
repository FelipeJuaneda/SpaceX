import { messages } from "./messages";
import { setLocale, useLocale } from "./store";

/** Current language, its messages, and the setter. Components re-render when it changes. */
export function useI18n() {
  const locale = useLocale();
  return { locale, m: messages[locale], setLocale };
}
