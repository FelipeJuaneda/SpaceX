import { Bookmark, BookmarkCheck } from "lucide-react";
import type { ExternalToast } from "sonner";
import { useI18n } from "@/i18n/useI18n";
import { cn } from "@/lib/cn";
import { savedStore, useSavedSlugs } from "./store";
import s from "./SaveButton.module.css";

/** Toasts load on first use, keeping the notification library out of the initial bundle. */
async function notify(message: string, options?: ExternalToast) {
  const { toast } = await import("sonner");
  toast(message, options);
}

interface Props {
  slug: string;
  mission: string;
  /** `icon` for dense rows, `label` for sheets. */
  variant?: "icon" | "label";
  className?: string;
}

export function SaveButton({ slug, mission, variant = "label", className }: Props) {
  const { m } = useI18n();
  const saved = useSavedSlugs().includes(slug);
  const Icon = saved ? BookmarkCheck : Bookmark;

  const toggle = () => {
    const nowSaved = savedStore.toggle(slug);
    if (nowSaved) void notify(m.save.added(mission));
    else
      void notify(m.save.removed(mission), {
        action: { label: m.save.undo, onClick: () => savedStore.toggle(slug) },
      });
  };

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={variant === "icon" ? m.save.icon(mission) : undefined}
      onClick={toggle}
      className={cn(s.button, s[variant], saved && s.on, className)}
    >
      <Icon aria-hidden="true" size={20} strokeWidth={1.75} />
      {variant === "label" && <span>{saved ? m.save.saved : m.save.save}</span>}
    </button>
  );
}
