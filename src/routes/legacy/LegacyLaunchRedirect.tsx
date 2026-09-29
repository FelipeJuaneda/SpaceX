import { Navigate, useParams } from "react-router";
import legacyIds from "@/data/legacy-ids.json";

/** `/launcher/:id` links from the previous version used SpaceX API ids. */
export function LegacyLaunchRedirect() {
  const { id = "" } = useParams();
  const slug = (legacyIds as Record<string, string>)[id];
  return <Navigate to={slug ? `/launches/${slug}` : "/launches"} replace />;
}
