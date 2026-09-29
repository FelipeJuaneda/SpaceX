import { describe, expect, it } from "vitest";
import { sampleLaunches } from "@/test/fixtures";
import { cadence, cumulative, groupByYear, nextScheduled, reuseFirsts, yearStats } from "./selectors";

describe("selectors", () => {
  it("builds one row per year, including years without flights", () => {
    const rows = yearStats(sampleLaunches);
    expect(rows[0]?.year).toBe(2006);
    expect(rows.at(-1)?.year).toBe(2024);
    expect(rows).toHaveLength(19);
    expect(rows.find((r) => r.year === 2011)?.flights).toBe(0);
    expect(rows.find((r) => r.year === 2015)).toMatchObject({ flights: 1, failures: 1 });
  });

  it("accumulates flights, landings and reflights in order", () => {
    const points = cumulative(sampleLaunches);
    expect(points).toHaveLength(4);
    expect(points.at(-1)).toMatchObject({ flights: 4, landed: 2, reflights: 1 });
  });

  it("finds reuse milestones in the record", () => {
    const { firstLanding, firstReflight } = reuseFirsts(sampleLaunches);
    expect(firstLanding?.mission).toBe("SpX-DM2 (Demonstration Mission 2)");
    expect(firstReflight?.mission).toBe("Starlink Group 10-49");
  });

  it("returns the next flight that has not lifted off", () => {
    expect(nextScheduled(sampleLaunches, Date.UTC(2026, 0, 1))?.mission).toBe("Crew-13");
    expect(nextScheduled(sampleLaunches, Date.UTC(2100, 0, 1))).toBeUndefined();
  });

  it("samples the trailing 30-day cadence weekly", () => {
    const points = cadence(sampleLaunches, Date.UTC(2006, 5, 1));
    expect(points[0]?.n).toBe(1);
    expect(points.at(-1)?.n).toBe(0);
  });

  it("groups a sorted list by calendar year", () => {
    expect(groupByYear(sampleLaunches).map((g) => [g.year, g.launches.length])).toEqual([
      [2006, 1],
      [2015, 1],
      [2020, 1],
      [2024, 1],
      [2099, 1],
    ]);
  });
});
