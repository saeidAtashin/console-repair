import { Suspense } from "react";

import TrackingLookup from "@/app/components/tracking/TrackingLookup";

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-zinc-400">در حال بارگذاری...</div>
      }
    >
      <TrackingLookup />
    </Suspense>
  );
}
