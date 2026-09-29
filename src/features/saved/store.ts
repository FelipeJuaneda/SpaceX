/**
 * Saved flights: a list of launch slugs in localStorage, read through useSyncExternalStore.
 * Only ids are stored, so saved flights always render current snapshot data.
 */
import { useSyncExternalStore } from "react";
import legacyIds from "@/data/legacy-ids.json";

const KEY = "downrange:saved";
/** Storage keys used by the previous version of the app (SpaceX API era). */
const LEGACY_KEY = "favoritelauncher";
const LEGACY_SORT_KEY = "sort";

type Listener = () => void;
const listeners = new Set<Listener>();
const EMPTY: readonly string[] = Object.freeze([]);
let cache: readonly string[] | null = null;

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* Storage unavailable (private mode, quota): saved flights live for this session only. */
  }
}

function parse(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

/** Moves favourites saved by the old app (SpaceX API ids) into the new store, once. */
function migrateLegacy(current: string[]): string[] {
  const raw = safeGet(LEGACY_KEY);
  if (raw === null) return current;
  const map = legacyIds as Record<string, string>;
  let legacy: unknown;
  try {
    legacy = JSON.parse(raw);
  } catch {
    legacy = [];
  }
  const migrated = Array.isArray(legacy)
    ? legacy
        .map((item) =>
          item && typeof item === "object" && "id" in item ? map[String(item.id)] : undefined,
        )
        .filter((slug): slug is string => Boolean(slug))
    : [];
  const merged = [...new Set([...current, ...migrated])];
  safeSet(KEY, JSON.stringify(merged));
  safeSet(LEGACY_KEY, null);
  safeSet(LEGACY_SORT_KEY, null);
  return merged;
}

function read(): readonly string[] {
  if (cache === null) cache = migrateLegacy(parse(safeGet(KEY)));
  return cache;
}

function write(next: string[]): void {
  cache = next;
  safeSet(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = parse(e.newValue);
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const savedStore = {
  get: read,
  has: (slug: string) => read().includes(slug),
  /** Returns true when the flight is now saved. */
  toggle(slug: string): boolean {
    const current = read();
    const saved = current.includes(slug);
    write(saved ? current.filter((s) => s !== slug) : [slug, ...current]);
    return !saved;
  },
  remove(slug: string): void {
    write(read().filter((s) => s !== slug));
  },
  /** Test helper: forget the in-memory cache so the next read hits storage. */
  reset(): void {
    cache = null;
  },
};

export function useSavedSlugs(): readonly string[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
