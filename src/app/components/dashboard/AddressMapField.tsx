"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const IranMapPicker = dynamic(() => import("./IranMapPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-sm text-zinc-500">
      در حال بارگذاری نقشه...
    </div>
  ),
});

type Props = {
  latitude: string;
  longitude: string;
  onChange: (lat: string, lng: string) => void;
};

export default function AddressMapField({ latitude, longitude, onChange }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-sm text-zinc-500">
        در حال بارگذاری نقشه...
      </div>
    );
  }

  return (
    <IranMapPicker
      latitude={latitude}
      longitude={longitude}
      onChange={onChange}
    />
  );
}
