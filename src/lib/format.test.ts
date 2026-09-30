import { afterEach, describe, expect, it } from "vitest";
import { setLocale } from "@/i18n/store";
import {
  countdownParts,
  formatInt,
  formatNet,
  formatOffset,
  formatStamp,
  isPrecise,
  ordinal,
} from "./format";

describe("formatNet", () => {
  const iso = "2026-11-15T12:00:00Z";
  it("prints no more precision than the record holds", () => {
    expect(formatNet(iso, "second")).toBe("15 Nov 2026");
    expect(formatNet(iso, "month")).toBe("November 2026");
    expect(formatNet(iso, "quarter")).toBe("Q4 2026");
    expect(formatNet(iso, "half")).toBe("H2 2026");
    expect(formatNet(iso, "year")).toBe("2026");
    expect(formatNet(iso, "decade")).toBe("2020s");
  });
});

describe("formatStamp", () => {
  it("adds a UTC time only for precise flights", () => {
    expect(formatStamp("2020-05-30T19:22:45Z", "second")).toBe("2020-05-30 19:22 UTC");
    expect(formatStamp("2026-11-15T12:00:00Z", "quarter")).toBe("Q4 2026");
  });
  it("knows which precisions can count down", () => {
    expect(isPrecise("minute")).toBe(true);
    expect(isPrecise("day")).toBe(false);
  });
});

describe("countdown", () => {
  it("splits the remaining time and pads it", () => {
    const now = Date.UTC(2026, 0, 1, 0, 0, 0);
    const target = now + (1 * 86400 + 2 * 3600 + 3 * 60 + 4) * 1000;
    expect(countdownParts(target, now)).toEqual({
      sign: "-",
      days: 1,
      hours: "02",
      minutes: "03",
      seconds: "04",
    });
    expect(countdownParts(now - 5000, now).sign).toBe("+");
  });

  it("prints offsets from T-0 like the countdown net", () => {
    expect(formatOffset(-2280)).toBe("T−00:38:00");
    expect(formatOffset(503)).toBe("T+00:08:23");
    expect(formatOffset(3717)).toBe("T+01:01:57");
  });
});

describe("text helpers", () => {
  it("writes ordinals", () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 37].map(ordinal)).toEqual([
      "1st",
      "2nd",
      "3rd",
      "4th",
      "11th",
      "12th",
      "13th",
      "21st",
      "22nd",
      "37th",
    ]);
  });
});

describe("Spanish interface", () => {
  afterEach(() => setLocale("en"));
  it("follows Spanish date and number conventions", () => {
    setLocale("es");
    const iso = "2026-11-15T12:00:00Z";
    expect(formatNet(iso, "quarter")).toBe("T4 2026");
    expect(formatNet(iso, "half")).toBe("S2 2026");
    expect(formatNet(iso, "month")).toMatch(/^noviembre (de )?2026$/);
    expect(formatInt(1234)).toBe("1.234");
    expect(ordinal(37)).toBe("37.º");
    expect(document.documentElement.lang).toBe("es");
  });
});
