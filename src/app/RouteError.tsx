import { isRouteErrorResponse, useRouteError } from "react-router";
import { StateMessage } from "@/components/ui/StateMessage";
import { PageMeta } from "@/components/layout/PageMeta";
import { Button, ButtonLink } from "@/components/ui/Button";

function isChunkError(error: unknown): boolean {
  return (
    error instanceof Error &&
    /dynamically imported module|Importing a module script failed/i.test(error.message)
  );
}

export function RouteError() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  const stale = isChunkError(error);

  return (
    <div className="page" style={{ paddingBlock: "var(--space-7)" }}>
      <PageMeta title={notFound ? "Off the chart" : "Something broke"} />
      <StateMessage
        variant="error"
        headingLevel={1}
        title={
          notFound
            ? "This page is off the chart"
            : stale
              ? "A newer version is available"
              : "The recorder jammed"
        }
        body={
          notFound
            ? "Nothing is plotted at this address."
            : stale
              ? "The site was updated while this tab was open. Reload to continue."
              : "Something went wrong while drawing this page. Reloading usually fixes it."
        }
        action={
          notFound ? (
            <ButtonLink to="/launches" variant="ink">
              Open the flight log
            </ButtonLink>
          ) : (
            <Button variant="ink" onClick={() => window.location.reload()}>
              Reload
            </Button>
          )
        }
      />
    </div>
  );
}
