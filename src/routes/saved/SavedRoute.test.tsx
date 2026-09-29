import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { savedStore } from "@/features/saved/store";
import { sampleLaunches } from "@/test/fixtures";
import { mockFetch, renderRoute } from "@/test/renderRoute";
import SavedRoute from "./SavedRoute";

const routes = [{ path: "/saved", Component: SavedRoute }];

beforeEach(() => {
  localStorage.clear();
  savedStore.reset();
});
afterEach(() => vi.unstubAllGlobals());

describe("Saved flights", () => {
  it("invites the visitor to save something when empty", async () => {
    mockFetch(() => sampleLaunches);
    renderRoute(routes, "/saved");
    expect(await screen.findByRole("heading", { name: "Nothing saved yet" })).toBeInTheDocument();
  });

  it("lists saved flights and disables ordering with a single one", async () => {
    savedStore.toggle("falcon-9-v11-spx-crs-7");
    mockFetch(() => sampleLaunches);
    renderRoute(routes, "/saved");
    expect(await screen.findByRole("link", { name: "SpX CRS-7" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "A–Z" })).toBeDisabled();
  });

  it("sorts A–Z and Z–A like the original favourites", async () => {
    const user = userEvent.setup();
    savedStore.toggle("falcon-1-falconsat-2");
    savedStore.toggle("falcon-9-v11-spx-crs-7");
    savedStore.toggle("falcon-9-block-5-spx-dm2");
    mockFetch(() => sampleLaunches);
    const { router } = renderRoute(routes, "/saved");
    await screen.findByRole("link", { name: "SpX CRS-7" });

    await user.click(screen.getByRole("radio", { name: "Z–A" }));
    const names = () => screen.getAllByRole("link").map((a) => a.textContent);
    expect(names()).toEqual(["SpX-DM2 (Demonstration Mission 2)", "SpX CRS-7", "FalconSAT-2"]);
    expect(router.state.location.search).toBe("?sort=za");

    await user.click(screen.getByRole("radio", { name: "A–Z" }));
    expect(names()).toEqual(["FalconSAT-2", "SpX CRS-7", "SpX-DM2 (Demonstration Mission 2)"]);
  });

  it("removes a flight from the list when unsaved", async () => {
    const user = userEvent.setup();
    savedStore.toggle("falcon-9-v11-spx-crs-7");
    mockFetch(() => sampleLaunches);
    renderRoute(routes, "/saved");
    await user.click(await screen.findByRole("button", { name: "Save SpX CRS-7" }));
    expect(await screen.findByRole("heading", { name: "Nothing saved yet" })).toBeInTheDocument();
  });
});
