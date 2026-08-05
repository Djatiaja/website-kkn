"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToString } from "react-dom/server";
import { Building2, School, Hospital, Droplet, MapPin } from "lucide-react";
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

const iconMap: Record<string, React.ReactNode> = {
  building: <Building2 className="w-5 h-5 text-neutral-600" />,
  school: <School className="w-5 h-5 text-neutral-600" />,
  hospital: <Hospital className="w-5 h-5 text-neutral-600" />,
  waterfall: <Droplet className="w-5 h-5 text-neutral-600" />,
};

const createCustomIcon = (icon?: string | null) => {
  const node = icon ? iconMap[icon] || <MapPin className="w-5 h-5 text-neutral-600" /> : <MapPin className="w-5 h-5 text-neutral-600" />;
  const iconHtml = renderToString(node);
  
  return L.divIcon({
    html: `<div class="bg-white border-2 border-primary rounded-full w-8 h-8 flex items-center justify-center shadow-lg">${iconHtml}</div>`,
    className: "custom-leaflet-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

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
  mapCenter?: [number, number];
}

export function VillageMap({ features, locale, flyTo, mapCenter }: VillageMapProps) {
  const boundaries = features.filter(f => f.type === "BOUNDARY");
  const points = features.filter(f => f.type === "POI" || f.type === "FACILITY");

  // Center on provided mapCenter, or first boundary/point, or fallback
  const center: [number, number] = (() => {
    if (mapCenter) return mapCenter;
    if (boundaries.length > 0) {
      const geom = boundaries[0].geometry as { type: string; coordinates: unknown };
      const coords = geom.type === "MultiPolygon"
        ? (geom.coordinates as number[][][][])[0][0]
        : (geom.coordinates as number[][][])[0];
      const lat = coords.reduce((s: number, c: number[]) => s + c[1], 0) / coords.length;
      const lng = coords.reduce((s: number, c: number[]) => s + c[0], 0) / coords.length;
      return [lat, lng];
    }
    if (points.length > 0) {
      const geom = points[0].geometry as { coordinates: [number, number] };
      return [geom.coordinates[1], geom.coordinates[0]];
    }
    return [-7.400, 110.100];
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

      {/* Boundaries — different colors for overlapping regions */}
      {boundaries.map((b, i) => {
        const colors = ["#2D6A4F", "#1B4332", "#40916C", "#52B788", "#74C69D"];
        const color = colors[i % colors.length];
        return (
          <GeoJSON
            key={b.id}
            data={{
              type: "Feature",
              geometry: b.geometry,
              properties: { name: locale === "id" ? b.nameId : b.nameEn },
            } as GeoJSON.Feature}
            style={{
              color,
              weight: 3,
              fillColor: color,
              fillOpacity: 0.15,
            }}
          />
        );
      })}

      {/* Point markers */}
      {points.map((p) => {
        const geom = p.geometry as { coordinates: [number, number] };
        const name = locale === "id" ? p.nameId : p.nameEn;
        const desc = locale === "id" ? p.descriptionId : p.descriptionEn;

        return (
          <Marker
            key={p.id}
            position={[geom.coordinates[1], geom.coordinates[0]]}
            icon={createCustomIcon(p.icon)}
          >
            <Popup>
              <div className="text-sm">
                <strong>{name}</strong>
                {desc && <p className="mt-1 text-neutral-600 [&_a]:underline [&_p]:mb-1 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4" dangerouslySetInnerHTML={{ __html: desc }} />}
              </div>
            </Popup>
          </Marker>
        );
      })}

      <FlyToHandler coords={flyTo || null} />
    </MapContainer>
  );
}
