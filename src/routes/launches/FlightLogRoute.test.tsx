import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { savedStore } from "@/features/saved/store";
import { sampleLaunches } from "@/test/fixtures";
import { mockFetch, renderRoute, status } from "@/test/renderRoute";
import FlightLogRoute from "./FlightLogRoute";

const routes = [{ path: "/launches", Component: FlightLogRoute }];

beforeEach(() => savedStore.reset());
afterEach(() => vi.unstubAllGlobals());

const rows = () => screen.getAllByRole("link").map((a) => a.textContent);

describe("Flight log", () => {
  it("lists flown flights grouped by year, newest first", async () => {
    mockFetch(() => sampleLaunches);
    renderRoute(routes, "/launches");
    expect(await screen.findByRole("heading", { level: 2, name: /2024/ })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("4 flights");
    expect(rows()).toEqual([
      "Starlink Group 10-49",
      "SpX-DM2 (Demonstration Mission 2)",
      "SpX CRS-7",
      "FalconSAT-2",
    ]);
  });

  it("filters by search and outcome and keeps them in the URL", async () => {
    const user = userEvent.setup();
    mockFetch(() => sampleLaunches);
    const { router } = renderRoute(routes, "/launches");
    await screen.findByText("FalconSAT-2");

    await user.type(screen.getByRole("searchbox", { name: "Search flights" }), "crs");
    await waitFor(() => expect(rows()).toEqual(["SpX CRS-7"]));
    expect(router.state.location.search).toBe("?q=crs");

    await user.clear(screen.getByRole("searchbox", { name: "Search flights" }));
    await user.click(screen.getByText("Filters"));
    await user.click(within(screen.getByRole("group", { name: "Outcome" })).getByRole("radio", { name: /Failures/ }));
    await waitFor(() => expect(rows()).toEqual(["SpX CRS-7", "FalconSAT-2"]));
    expect(router.state.location.search).toBe("?outcome=failure");
  });

  it("restores filters from a shared link", async () => {
    mockFetch(() => sampleLaunches);
    renderRoute(routes, "/launches?outcome=upcoming");
    expect(await screen.findByText("Crew-13")).toBeInTheDocument();
    expect(rows()).toEqual(["Crew-13"]);
  });

  it("explains an empty result and offers a reset", async () => {
    const user = userEvent.setup();
    mockFetch(() => sampleLaunches);
    renderRoute(routes, "/launches?q=apollo");
    expect(await screen.findByRole("heading", { name: "Nothing on this stretch of the roll" })).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "Reset filters" })[0]!);
    expect(await screen.findByText("FalconSAT-2")).toBeInTheDocument();
  });

  it("recovers from a failed request", async () => {
    const user = userEvent.setup();
    let fail = true;
    mockFetch(() => (fail ? status(503) : sampleLaunches));
    renderRoute(routes, "/launches");
    expect(await screen.findByRole("alert")).toHaveTextContent("The flight log did not load");
    fail = false;
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("FalconSAT-2")).toBeInTheDocument();
  });
});
