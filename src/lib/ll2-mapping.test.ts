import { describe, expect, it } from "vitest";
import { familyOf, missionFromName, outcomeOf, parseDuration, precisionOf, slugify } from "./ll2-mapping";

describe("parseDuration", () => {
  it.each([
    ["-PT53M", -3180],
    ["P0D", 0],
    ["PT2M26S", 146],
    ["PT1H1M57S", 3717],
    ["P3DT4H", 3 * 86400 + 4 * 3600],
    ["-PT45S", -45],
  ])("parses %s", (input, seconds) => {
    expect(parseDuration(input)).toBe(seconds);
  });

  it("returns null for missing or malformed values", () => {
    expect(parseDuration(null)).toBeNull();
    expect(parseDuration("")).toBeNull();
    expect(parseDuration("5 minutes")).toBeNull();
  });
});

describe("outcomeOf", () => {
  it("maps flown statuses and treats everything else as upcoming", () => {
    expect(outcomeOf("Success")).toBe("success");
    expect(outcomeOf("Failure")).toBe("failure");
    expect(outcomeOf("Partial Failure")).toBe("partial");
    expect(outcomeOf("Go")).toBe("upcoming");
    expect(outcomeOf("TBD")).toBe("upcoming");
  });
});

describe("precisionOf", () => {
  it("maps known precisions", () => {
    expect(precisionOf("SEC", "upcoming")).toBe("second");
    expect(precisionOf("Q4", "upcoming")).toBe("quarter");
    expect(precisionOf("FY", "upcoming")).toBe("year");
  });

  it("never invents precision for scheduled flights without one", () => {
    expect(precisionOf(undefined, "upcoming")).toBe("month");
    expect(precisionOf(null, "success")).toBe("minute");
  });
});

describe("naming helpers", () => {
  it("groups configurations into families", () => {
    expect(familyOf("Falcon 1")).toBe("falcon-1");
    expect(familyOf("Falcon 9 Block 5")).toBe("falcon-9");
    expect(familyOf("Falcon Heavy")).toBe("falcon-heavy");
    expect(familyOf("Starship V3")).toBe("starship");
  });

  it("extracts the mission from an LL2 launch name", () => {
    expect(missionFromName("Falcon 9 Block 5 | Crew-13")).toBe("Crew-13");
    expect(missionFromName("Untitled")).toBe("Untitled");
  });

  it("slugifies vehicle names", () => {
    expect(slugify("Falcon 9 v1.1")).toBe("falcon-9-v1-1");
  });
});
