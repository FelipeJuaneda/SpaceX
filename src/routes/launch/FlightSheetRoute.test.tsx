import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { savedStore } from "@/features/saved/store";
import { detail } from "@/test/fixtures";
import { mockFetch, renderRoute, status } from "@/test/renderRoute";
import FlightSheetRoute from "./FlightSheetRoute";

const routes = [{ path: "/launches/:slug", Component: FlightSheetRoute }];

beforeEach(() => savedStore.reset());
afterEach(() => vi.unstubAllGlobals());

describe("Flight sheet", () => {
  it("shows the flight, its outcome and its T-minus sequence", async () => {
    mockFetch(() =>
      detail({
        flight: 96,
        mission: "SpX-DM2",
        crewed: true,
        timeline: [
          { t: -2280, label: "GO for Prop Load", description: null },
          { t: 0, label: "Liftoff", description: null },
          { t: 146, label: "MECO", description: null },
        ],
        spacecraft: [
          {
            name: "Crew Dragon Endeavour",
            serial: "C206",
            destination: "ISS",
            crew: [{ name: "Douglas G. Hurley", role: "Commander", agency: "NASA" }],
          },
        ],
      }),
    );
    renderRoute(routes, "/launches/falcon-9-demo");
    expect(await screen.findByRole("heading", { level: 1, name: "SpX-DM2" })).toBeInTheDocument();
    expect(screen.getByText("Flight")).toBeInTheDocument();
    expect(screen.getAllByText("Success").length).toBeGreaterThan(0);
    expect(screen.getByText("MECO")).toBeInTheDocument();
    expect(screen.getByText("Douglas G. Hurley")).toBeInTheDocument();
  });

  it("explains what went wrong on a failed flight", async () => {
    mockFetch(() =>
      detail({ outcome: "failure", failReason: "Support strut failure in the second stage." }),
    );
    renderRoute(routes, "/launches/falcon-9-demo");
    expect(await screen.findByRole("heading", { name: /What went wrong/ })).toBeInTheDocument();
    expect(screen.getByText("Support strut failure in the second stage.")).toBeInTheDocument();
  });

  it("lets a visitor save the flight", async () => {
    const user = userEvent.setup();
    mockFetch(() => detail());
    renderRoute(routes, "/launches/falcon-9-demo");
    const save = await screen.findByRole("button", { name: "Save flight" });
    expect(save).toHaveAttribute("aria-pressed", "false");
    await user.click(save);
    expect(screen.getByRole("button", { name: "Saved" })).toHaveAttribute("aria-pressed", "true");
    expect(savedStore.has("falcon-9-demo")).toBe(true);
  });

  it("sends an unknown flight to the flight log search", async () => {
    mockFetch(() => status(404));
    renderRoute(routes, "/launches/falcon-9-mystery");
    expect(
      await screen.findByRole("heading", { name: "No flight at this address" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Search the flight log" })).toHaveAttribute(
      "href",
      "/launches?q=falcon%209%20mystery&outcome=all",
    );
  });

  it("offers a retry when the request fails", async () => {
    const user = userEvent.setup();
    let fail = true;
    mockFetch(() => (fail ? status(500) : detail({ mission: "Recovered" })));
    renderRoute(routes, "/launches/falcon-9-demo");
    expect(
      await screen.findByRole("heading", { name: "This flight sheet did not load" }),
    ).toBeInTheDocument();
    fail = false;
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByRole("heading", { level: 1, name: "Recovered" })).toBeInTheDocument();
  });
});
