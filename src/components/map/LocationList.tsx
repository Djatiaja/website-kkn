"use client";

import type { MapFeature } from "@/types";

interface LocationListProps {
  features: MapFeature[];
  locale: "id" | "en";
  onLocationClick: (coords: [number, number]) => void;
}

const typeIcons: Record<string, string> = {
  POI: "📍",
  FACILITY: "🏛️",
  ROAD: "🛤️",
  BOUNDARY: "🗺️",
};

const featureIcons: Record<string, string> = {
  building: "🏛️",
  school: "🏫",
  mosque: "🕌",
  hospital: "🏥",
  waterfall: "💧",
};

export function LocationList({ features, locale, onLocationClick }: LocationListProps) {
  if (features.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map((feature) => {
        const name = locale === "id" ? feature.nameId : feature.nameEn;
        const desc = locale === "id" ? feature.descriptionId : feature.descriptionEn;
        const icon = feature.icon ? featureIcons[feature.icon] || typeIcons[feature.type] : typeIcons[feature.type];
        const geom = feature.geometry as { coordinates: [number, number] };

        return (
          <button
            key={feature.id}
            onClick={() => onLocationClick(geom.coordinates)}
            className="flex items-start gap-3 p-4 rounded-xl border border-neutral-200 bg-white hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-left"
          >
            <span className="text-2xl flex-shrink-0">{icon}</span>
            <div className="min-w-0">
              <p className="font-heading font-semibold text-sm text-neutral-900 truncate">{name}</p>
              {desc && (
                <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{desc}</p>
              )}
              <span className="inline-block mt-1 text-xs text-primary/70 bg-primary/5 px-2 py-0.5 rounded-full">
                {feature.type}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
