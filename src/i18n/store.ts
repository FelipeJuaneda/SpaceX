/**
 * Interface language: English or Spanish. Detected from the browser on first visit,
 * then remembered. Launch data from the source (mission descriptions, statuses, event
 * names) is only published in English and is shown as-is.
 */
import { useSyncExternalStore } from "react";

export type Locale = "en" | "es";

const KEY = "downrange:locale";
const listeners = new Set<() => void>();

function detect(): Locale {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "en" || stored === "es") return stored;
  } catch {
    /* storage unavailable */
  }
  const language = typeof navigator === "undefined" ? "en" : navigator.language;
  return language.toLowerCase().startsWith("es") ? "es" : "en";
}

function applyToDocument(locale: Locale): void {
  if (typeof document !== "undefined") document.documentElement.lang = locale;
}

let current: Locale = detect();
applyToDocument(current);

export function getLocale(): Locale {
  return current;
}

export function setLocale(locale: Locale): void {
  if (locale === current) return;
  current = locale;
  try {
    localStorage.setItem(KEY, locale);
  } catch {
    /* the choice lasts for this session only */
  }
  applyToDocument(locale);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, getLocale, () => "en");
}
