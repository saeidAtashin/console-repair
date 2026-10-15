"use client";

import type { ComponentProps } from "react";
import { usePathname } from "next/navigation";

import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppUrl } from "@/lib/seo/whatsapp";

type Props = Omit<ComponentProps<"a">, "href"> & {
  repairHref?: string;
};

export default function TrackedWhatsAppLink({
  repairHref,
  onClick,
  children,
  ...props
}: Props) {
  const pathname = usePathname();
  const href = buildWhatsAppUrl({ pagePath: pathname, repairHref });

  return (
    <a
      {...props}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        trackEvent("whatsapp_click", { page_path: pathname });
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
