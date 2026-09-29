import { beforeEach, describe, expect, it } from "vitest";
import { savedStore } from "./store";

beforeEach(() => {
  localStorage.clear();
  savedStore.reset();
});

describe("saved flights store", () => {
  it("toggles a flight and persists slugs only", () => {
    expect(savedStore.toggle("falcon-9-block-5-crew-5")).toBe(true);
    expect(savedStore.has("falcon-9-block-5-crew-5")).toBe(true);
    expect(JSON.parse(localStorage.getItem("downrange:saved") ?? "[]")).toEqual(["falcon-9-block-5-crew-5"]);
    expect(savedStore.toggle("falcon-9-block-5-crew-5")).toBe(false);
    expect(savedStore.get()).toEqual([]);
  });

  it("keeps the most recently saved flight first", () => {
    savedStore.toggle("a");
    savedStore.toggle("b");
    expect(savedStore.get()).toEqual(["b", "a"]);
  });

  it("migrates favourites saved by the previous version of the app", () => {
    // The old app stored whole SpaceX API launch objects under "favoritelauncher".
    localStorage.setItem(
      "favoritelauncher",
      JSON.stringify([{ id: "5eb87d46ffd86e000604b388", name: "CCtCap Demo Mission 2" }, { id: "unknown" }]),
    );
    localStorage.setItem("sort", "ascend");
    savedStore.reset();

    expect(savedStore.get()).toEqual(["falcon-9-block-5-spx-dm2-demonstration-mission-2"]);
    expect(localStorage.getItem("favoritelauncher")).toBeNull();
    expect(localStorage.getItem("sort")).toBeNull();
  });

  it("survives corrupted storage", () => {
    localStorage.setItem("downrange:saved", "{not json");
    savedStore.reset();
    expect(savedStore.get()).toEqual([]);
  });
});
