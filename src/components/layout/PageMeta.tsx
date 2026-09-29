const SITE = "Downrange";
const DEFAULT_DESCRIPTION =
  "Every SpaceX flight since 2006 on one continuous strip chart: the next launch, outcomes, booster landings and the fleet to scale. An unofficial explorer.";

interface Props {
  /** Page title; omitted on the home page. */
  title?: string;
  description?: string;
}

/** React 19 hoists these elements into <head>. */
export function PageMeta({ title, description = DEFAULT_DESCRIPTION }: Props) {
  const full = title ? `${title} · ${SITE}` : `${SITE} — the SpaceX flight record`;
  return (
    <>
      <title>{full}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
    </>
  );
}
