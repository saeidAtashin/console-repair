"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [35.6892, 51.389];

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  latitude: string;
  longitude: string;
  onChange: (lat: string, lng: string) => void;
};

function ClickHandler({
  onChange,
}: {
  onChange: (lat: string, lng: string) => void;
}) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6));
    },
  });
  return null;
}

export default function IranMapPicker({
  latitude,
  longitude,
  onChange,
}: Props) {
  const position = useMemo((): [number, number] => {
    const lat = Number.parseFloat(latitude);
    const lng = Number.parseFloat(longitude);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];
    return DEFAULT_CENTER;
  }, [latitude, longitude]);

  useEffect(() => {
    if (!latitude || !longitude) {
      onChange(DEFAULT_CENTER[0].toFixed(6), DEFAULT_CENTER[1].toFixed(6));
    }
    // Only seed defaults when empty on mount / when cleared
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <p className="border-b border-white/10 bg-black/40 px-4 py-2 text-xs text-zinc-400">
        روی نقشه کلیک کنید تا موقعیت آدرس انتخاب شود
      </p>
      <MapContainer
        center={position}
        zoom={12}
        scrollWheelZoom
        className="z-0 h-64 w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onChange={onChange} />
        <Marker position={position} icon={markerIcon} />
      </MapContainer>
      <div className="grid grid-cols-2 gap-2 border-t border-white/10 bg-black/40 px-4 py-3 text-xs text-zinc-400">
        <span dir="ltr">lat: {position[0]}</span>
        <span dir="ltr">lng: {position[1]}</span>
      </div>
    </div>
  );
}
