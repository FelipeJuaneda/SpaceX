import { isRouteErrorResponse, useRouteError } from "react-router";
import { PageMeta } from "@/components/layout/PageMeta";
import { Button, ButtonLink } from "@/components/ui/Button";
import { StateMessage } from "@/components/ui/StateMessage";
import { useI18n } from "@/i18n/useI18n";

function isChunkError(error: unknown): boolean {
  return (
    error instanceof Error &&
    /dynamically imported module|Importing a module script failed/i.test(error.message)
  );
}

export function RouteError() {
  const { m } = useI18n();
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  const stale = isChunkError(error);

  return (
    <div className="page" style={{ paddingBlock: "var(--space-7)" }}>
      <PageMeta title={notFound ? m.error.offChart : m.error.broke} />
      <StateMessage
        variant="error"
        headingLevel={1}
        title={notFound ? m.error.notFoundTitle : stale ? m.error.staleTitle : m.error.jammedTitle}
        body={notFound ? m.error.notFoundBody : stale ? m.error.staleBody : m.error.jammedBody}
        action={
          notFound ? (
            <ButtonLink to="/launches" variant="ink">
              {m.error.openLog}
            </ButtonLink>
          ) : (
            <Button variant="ink" onClick={() => window.location.reload()}>
              {m.common.reload}
            </Button>
          )
        }
      />
    </div>
  );
}
