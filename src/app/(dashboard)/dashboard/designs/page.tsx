import { createPageMetadata } from "@/lib/seo/metadata";
import DesignsDashboardClient from "./DesignsDashboardClient";

export const metadata = createPageMetadata({
  title: "آثار من",
  path: "/dashboard/designs",
});

export default function DesignsPage() {
  return <DesignsDashboardClient />;
}
