import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { RouterProvider, createMemoryRouter, type RouteObject } from "react-router";
import { vi } from "vitest";

/** Renders routes in a memory router with a fresh, non-retrying query client. */
export function renderRoute(routes: RouteObject[], path: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const utils = render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return { ...utils, router };
}

type Handler = (url: string) => unknown;

/** Stubs `fetch`; a handler may return a Response (for errors) or any JSON-serialisable body. */
export function mockFetch(handler: Handler) {
  const fn = vi.fn(async (input: RequestInfo | URL) => {
    const body = handler(String(input));
    if (body instanceof Response) return body;
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

export const status = (code: number) => new Response("{}", { status: code });
