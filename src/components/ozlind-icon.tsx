"use client";

import type { SVGProps } from "react";

export const OZLIND_ICON_NAMES = [
  "oz-logo", "oz-logo-small", "oz-logo-text", "oz-model-flash", "oz-model-pro", "oz-model-max", "oz-avatar",
  "oz-new-chat", "oz-search", "oz-library", "oz-history", "oz-star", "oz-star-fill", "oz-folder", "oz-projects", "oz-gpts", "oz-video", "oz-artifacts", "oz-code", "oz-image", "oz-trash", "oz-archive",
  "oz-attach", "oz-mic", "oz-send", "oz-send-outline", "oz-stop", "oz-copy", "oz-check", "oz-like", "oz-dislike", "oz-regenerate", "oz-edit", "oz-share", "oz-download", "oz-sparkles", "oz-thinking", "oz-voice-wave", "oz-globe", "oz-bookmark", "oz-pin",
  "oz-chevron-down", "oz-chevron-up", "oz-chevron-left", "oz-chevron-right", "oz-menu", "oz-close", "oz-more", "oz-more-vertical", "oz-expand", "oz-collapse", "oz-notification",
  "oz-settings", "oz-upgrade", "oz-crown", "oz-key", "oz-shield", "oz-user", "oz-logout", "oz-help", "oz-moon", "oz-sun", "oz-language"
] as const;

export type OzlindIconName = (typeof OZLIND_ICON_NAMES)[number];

type OzlindIconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: OzlindIconName;
  size?: number | string;
  title?: string;
};

export function OzlindIcon({ name, size = 20, title, ...props }: OzlindIconProps) {
  const accessibleProps = title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true as const };

  return (
    <svg
      width={size}
      height={size}
      viewBox={name === "oz-logo" ? "0 0 48 48" : name === "oz-logo-text" ? "0 0 120 24" : "0 0 24 24"}
      fill="none"
      focusable="false"
      {...accessibleProps}
      {...props}
    >
      <use href={`/icons/ozlind-brand-system.svg#${name}`} />
    </svg>
  );
}
