"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapFeature } from "@/types";

// Fix default marker icon
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = defaultIcon;

const iconMap: Record<string, string> = {
  building: "🏛️",
  school: "🏫",
  mosque: "🕌",
  hospital: "🏥",
  waterfall: "💧",
};

function createEmojiIcon(icon?: string | null) {
  const emoji = icon ? iconMap[icon] || "📍" : "📍";
  return L.divIcon({
    html: `<span style="font-size:24px">${emoji}</span>`,
    className: "emoji-marker",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
}

interface FlyToProps {
  coords: [number, number] | null;
}

function FlyToHandler({ coords }: FlyToProps) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords[1], coords[0]], 16, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

interface VillageMapProps {
  features: MapFeature[];
  locale: "id" | "en";
  flyTo?: [number, number] | null;
}

export function VillageMap({ features, locale, flyTo }: VillageMapProps) {
  const boundaries = features.filter(f => f.type === "BOUNDARY");
  const points = features.filter(f => f.type === "POI" || f.type === "FACILITY");

  // Center on first boundary or first point
  const center: [number, number] = (() => {
    if (boundaries.length > 0) {
      const geom = boundaries[0].geometry as { coordinates: number[][][] };
      const coords = geom.coordinates[0];
      const lat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
      const lng = coords.reduce((s, c) => s + c[0], 0) / coords.length;
      return [lat, lng];
    }
    if (points.length > 0) {
      const geom = points[0].geometry as { coordinates: [number, number] };
      return [geom.coordinates[1], geom.coordinates[0]];
    }
    return [-6.730, 106.838];
  })();

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: "70vh", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Boundaries */}
      {boundaries.map((b) => (
        <GeoJSON
          key={b.id}
          data={{
            type: "Feature",
            geometry: b.geometry,
            properties: { name: locale === "id" ? b.nameId : b.nameEn },
          } as GeoJSON.Feature}
          style={{
            color: "#2D6A4F",
            weight: 3,
            fillColor: "#2D6A4F",
            fillOpacity: 0.1,
          }}
        />
      ))}

      {/* Point markers */}
      {points.map((p) => {
        const geom = p.geometry as { coordinates: [number, number] };
        const name = locale === "id" ? p.nameId : p.nameEn;
        const desc = locale === "id" ? p.descriptionId : p.descriptionEn;

        return (
          <Marker
            key={p.id}
            position={[geom.coordinates[1], geom.coordinates[0]]}
            icon={createEmojiIcon(p.icon)}
          >
            <Popup>
              <div className="text-sm">
                <strong>{name}</strong>
                {desc && <p className="mt-1 text-neutral-600">{desc}</p>}
              </div>
            </Popup>
          </Marker>
        );
      })}

      <FlyToHandler coords={flyTo || null} />
    </MapContainer>
  );
}
