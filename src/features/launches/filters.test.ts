import { describe, expect, it } from "vitest";
import { sampleLaunches } from "@/test/fixtures";
import {
  DEFAULT_FILTERS,
  applyFilters,
  isFiltered,
  outcomeCounts,
  readFilters,
  toSearchParams,
} from "./filters";

const params = (query: string) => new URLSearchParams(query);
const missions = (list: { mission: string }[]) => list.map((l) => l.mission);

describe("URL state", () => {
  it("reads defaults from an empty query", () => {
    expect(readFilters(params(""))).toEqual(DEFAULT_FILTERS);
  });

  it("ignores values it does not understand", () => {
    const f = readFilters(params("outcome=exploded&family=saturn-v&year=1969&sort=random"));
    expect(f.outcome).toBe("flown");
    expect(f.family).toBe("all");
    expect(f.year).toBeNull();
    expect(f.sort).toBe("newest");
  });

  it("round-trips non-default filters and omits defaults", () => {
    const f = readFilters(
      params("q=crew&outcome=failure&family=falcon-9&year=2015&crewed=1&sort=oldest"),
    );
    expect(readFilters(toSearchParams(f))).toEqual(f);
    expect(toSearchParams(DEFAULT_FILTERS).toString()).toBe("");
  });

  it("sorts scheduled flights soonest-first by default", () => {
    const f = readFilters(params("outcome=upcoming"));
    expect(f.sort).toBe("oldest");
    expect(toSearchParams(f).toString()).toBe("outcome=upcoming");
    expect(isFiltered(f)).toBe(true);
  });
});

describe("applyFilters", () => {
  it("shows flown flights, newest first, by default", () => {
    expect(missions(applyFilters(sampleLaunches, DEFAULT_FILTERS))).toEqual([
      "Starlink Group 10-49",
      "SpX-DM2 (Demonstration Mission 2)",
      "SpX CRS-7",
      "FalconSAT-2",
    ]);
  });

  it("filters by outcome, family, year and crew", () => {
    expect(
      missions(applyFilters(sampleLaunches, { ...DEFAULT_FILTERS, outcome: "failure" })),
    ).toEqual(["SpX CRS-7", "FalconSAT-2"]);
    expect(applyFilters(sampleLaunches, { ...DEFAULT_FILTERS, family: "falcon-1" })).toHaveLength(
      1,
    );
    expect(missions(applyFilters(sampleLaunches, { ...DEFAULT_FILTERS, year: 2015 }))).toEqual([
      "SpX CRS-7",
    ]);
    expect(
      missions(applyFilters(sampleLaunches, { ...DEFAULT_FILTERS, outcome: "all", crewed: true })),
    ).toEqual(["Crew-13", "SpX-DM2 (Demonstration Mission 2)"]);
  });

  it("searches every word across the record, ignoring case and accents", () => {
    expect(
      missions(applyFilters(sampleLaunches, { ...DEFAULT_FILTERS, q: "demonstration FALCON" })),
    ).toEqual(["SpX-DM2 (Demonstration Mission 2)"]);
    expect(applyFilters(sampleLaunches, { ...DEFAULT_FILTERS, q: "kennedy" })).toHaveLength(4);
    expect(applyFilters(sampleLaunches, { ...DEFAULT_FILTERS, q: "zzz" })).toHaveLength(0);
  });

  it("finds a flight by its number", () => {
    expect(missions(applyFilters(sampleLaunches, { ...DEFAULT_FILTERS, q: "#2" }))).toEqual([
      "SpX CRS-7",
    ]);
  });

  it("counts outcomes for the filter keys", () => {
    expect(outcomeCounts(sampleLaunches)).toEqual({
      flown: 4,
      success: 2,
      failure: 2,
      upcoming: 1,
      all: 5,
    });
  });
});
