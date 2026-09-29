/**
 * Downloads the full SpaceX record from Launch Library 2 and writes the static
 * snapshot the app reads from `public/data/`.
 *
 *   npm run sync              fetch from LL2 (9 requests, within the 15/hour anonymous limit)
 *   npm run sync:offline      rebuild from the raw pages cached in .cache/ll2
 */
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import type { SnapshotMeta } from "../src/types/domain.ts";
import type { LL2Launch, LL2Page } from "./ll2-types.ts";
import { normalize } from "./normalize.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const CACHE_DIR = path.join(ROOT, ".cache", "ll2");
const OUT_DIR = path.join(ROOT, "public", "data");
const BASE = process.env.LL2_BASE ?? "https://ll.thespacedevs.com/2.3.0";
const FIRST_PAGE = `${BASE}/launches/?lsp__id=121&mode=detailed&ordering=net&limit=100`;
const fromCache = process.argv.includes("--from-cache");

async function fetchPages(): Promise<void> {
  await rm(CACHE_DIR, { recursive: true, force: true });
  await mkdir(CACHE_DIR, { recursive: true });
  let url: string | null = FIRST_PAGE;
  let page = 0;
  while (url) {
    const res = await fetch(url, {
      headers: { "User-Agent": "downrange-sync (+https://github.com/FelipeJuaneda/SpaceX)" },
      signal: AbortSignal.timeout(300_000),
    });
    if (res.status === 429) {
      const wait = Number(res.headers.get("retry-after") ?? 900);
      console.warn(`Rate limited by LL2, waiting ${wait}s…`);
      await sleep(wait * 1000 + 1000);
      continue;
    }
    if (!res.ok) throw new Error(`LL2 responded ${res.status} for ${url}`);
    const body = (await res.json()) as LL2Page<LL2Launch>;
    await writeFile(
      path.join(CACHE_DIR, `page-${String(page).padStart(2, "0")}.json`),
      JSON.stringify(body),
    );
    console.log(`page ${page}: ${body.results.length} launches (of ${body.count})`);
    url = body.next;
    page += 1;
  }
}

async function readCachedLaunches(): Promise<LL2Launch[]> {
  const files = (await readdir(CACHE_DIR)).filter((f) => f.endsWith(".json")).sort();
  if (files.length === 0)
    throw new Error(`No cached pages in ${CACHE_DIR}. Run "npm run sync" first.`);
  const pages = await Promise.all(
    files.map(
      async (f) =>
        JSON.parse(await readFile(path.join(CACHE_DIR, f), "utf8")) as LL2Page<LL2Launch>,
    ),
  );
  const expected = pages[0]?.count ?? 0;
  const launches = pages.flatMap((p) => p.results);
  if (launches.length !== expected) {
    throw new Error(`Cache is incomplete: ${launches.length} of ${expected} launches.`);
  }
  return launches;
}

/** When the record was downloaded: the first cached page's modification time. */
async function fetchedAt(): Promise<string> {
  const first = (await readdir(CACHE_DIR)).filter((f) => f.endsWith(".json")).sort()[0];
  if (!first) return new Date().toISOString();
  return (await stat(path.join(CACHE_DIR, first))).mtime.toISOString();
}

async function writeSnapshot(raw: LL2Launch[]): Promise<void> {
  const { index, details, rockets, records } = normalize(raw);
  const detailDir = path.join(OUT_DIR, "launches");
  await rm(detailDir, { recursive: true, force: true });
  await mkdir(detailDir, { recursive: true });

  const meta: SnapshotMeta = {
    generatedAt: await fetchedAt(),
    source: { name: "Launch Library 2 — The Space Devs", url: "https://thespacedevs.com/llapi" },
    counts: {
      launches: index.length,
      flown: index.filter((l) => l.outcome !== "upcoming").length,
      upcoming: index.filter((l) => l.outcome === "upcoming").length,
      rockets: rockets.length,
    },
    records,
  };

  await Promise.all([
    writeFile(path.join(OUT_DIR, "launches.json"), JSON.stringify(index)),
    writeFile(path.join(OUT_DIR, "rockets.json"), JSON.stringify(rockets)),
    writeFile(path.join(OUT_DIR, "meta.json"), JSON.stringify(meta, null, 2) + "\n"),
    ...details.map((d) => writeFile(path.join(detailDir, `${d.slug}.json`), JSON.stringify(d))),
  ]);
  console.log(
    `Wrote ${index.length} launches (${meta.counts.flown} flown, ${meta.counts.upcoming} upcoming) and ${rockets.length} vehicles to public/data.`,
  );
}

if (!fromCache) await fetchPages();
await writeSnapshot(await readCachedLaunches());
