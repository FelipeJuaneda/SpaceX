import { useI18n } from "@/i18n/useI18n";

interface Props {
  /** Page title; omitted on the home page. */
  title?: string;
  description?: string;
}

/** React 19 hoists these elements into <head>. */
export function PageMeta({ title, description }: Props) {
  const { m } = useI18n();
  const full = title ? `${title} · ${m.meta.site}` : m.meta.home;
  const desc = description ?? m.meta.description;
  return (
    <>
      <title>{full}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={desc} />
    </>
  );
}
