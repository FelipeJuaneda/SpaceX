import type { ComponentType } from "react";
import { Navigate, createBrowserRouter } from "react-router";
import {
  launchQuery,
  launchesQuery,
  metaQuery,
  rocketsQuery,
} from "@/features/launches/queries";
import { LegacyLaunchRedirect } from "@/routes/legacy/LegacyLaunchRedirect";
import { RootLayout } from "./RootLayout";
import { RouteError } from "./RouteError";
import { queryClient } from "./queryClient";

/** Code-split route module: the chunk loads on first visit. */
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
});

const snapshot = {
  launches: () => queryClient.prefetchQuery(launchesQuery()),
  meta: () => queryClient.prefetchQuery(metaQuery()),
  rockets: () => queryClient.prefetchQuery(rocketsQuery()),
};

/** Start fetching snapshot data in parallel with the route chunk; components read it with useQuery. */
const prefetch =
  (...fetchers: (() => Promise<void>)[]) =>
  () => {
    for (const f of fetchers) void f();
    return null;
  };

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: RouteError,
    children: [
      {
        ErrorBoundary: RouteError,
        children: [
          {
            index: true,
            loader: prefetch(snapshot.launches, snapshot.meta),
            lazy: page(() => import("@/routes/home/HomeRoute")),
          },
          {
            path: "launches",
            loader: prefetch(snapshot.launches),
            lazy: page(() => import("@/routes/launches/FlightLogRoute")),
          },
          {
            path: "launches/:slug",
            loader: ({ params }) => {
              if (params.slug) void queryClient.prefetchQuery(launchQuery(params.slug));
              return null;
            },
            lazy: page(() => import("@/routes/launch/FlightSheetRoute")),
          },
          {
            path: "rockets",
            loader: prefetch(snapshot.rockets, snapshot.launches),
            lazy: page(() => import("@/routes/rockets/FleetRoute")),
          },
          {
            path: "rockets/:slug",
            loader: prefetch(snapshot.rockets, snapshot.launches),
            lazy: page(() => import("@/routes/rocket/RocketRoute")),
          },
          {
            path: "saved",
            loader: prefetch(snapshot.launches),
            lazy: page(() => import("@/routes/saved/SavedRoute")),
          },
          {
            path: "about",
            loader: prefetch(snapshot.meta),
            lazy: page(() => import("@/routes/about/AboutRoute")),
          },
          // Links from the previous version of the app.
          { path: "favorites", element: <Navigate to="/saved" replace /> },
          { path: "launcher/:id", Component: LegacyLaunchRedirect },
          { path: "*", lazy: page(() => import("@/routes/not-found/NotFoundRoute")) },
        ],
      },
    ],
  },
]);
