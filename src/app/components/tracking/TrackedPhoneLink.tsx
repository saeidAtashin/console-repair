"use client";

import type { ComponentProps } from "react";
import { usePathname } from "next/navigation";

import { trackEvent } from "@/lib/analytics";
import { SITE_TEL_HREF } from "@/lib/seo/site";

type Props = Omit<ComponentProps<"a">, "href"> & {
  href?: string;
};

export default function TrackedPhoneLink({
  href = SITE_TEL_HREF,
  onClick,
  children,
  ...props
}: Props) {
  const pathname = usePathname();

  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        trackEvent("phone_click", { page_path: pathname });
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
