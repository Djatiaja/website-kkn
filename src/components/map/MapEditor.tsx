"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, GeoJSON, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

// leaflet-draw is a UMD module that expects global `L`
if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).L = L;
}
require("leaflet-draw");
import { renderToString } from "react-dom/server";
import { MapPin, Building2, School, Hospital, Droplet } from "lucide-react";
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
  building: <Building2 className="w-4 h-4 text-neutral-600" />,
  school: <School className="w-4 h-4 text-neutral-600" />,
  hospital: <Hospital className="w-4 h-4 text-neutral-600" />,
  waterfall: <Droplet className="w-4 h-4 text-neutral-600" />,
};

const createCustomIcon = (icon?: string | null) => {
  const node = icon ? iconMap[icon] || <MapPin className="w-4 h-4 text-neutral-600" /> : <MapPin className="w-4 h-4 text-neutral-600" />;
  const iconHtml = renderToString(node);
  return L.divIcon({
    html: `<div class="bg-white border-2 border-primary rounded-full w-8 h-8 flex items-center justify-center shadow-lg">${iconHtml}</div>`,
    className: "custom-leaflet-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// ─── Center calculation from context features ─────────────
function getCenter(features: MapFeature[]): [number, number] {
  for (const f of features) {
    if (f.type === "BOUNDARY") {
      const geom = f.geometry as { type: string; coordinates: unknown };
      const coords = geom.type === "MultiPolygon"
        ? (geom.coordinates as number[][][][])[0][0]
        : (geom.coordinates as number[][][])[0];
      const lat = coords.reduce((s: number, c: number[]) => s + c[1], 0) / coords.length;
      const lng = coords.reduce((s: number, c: number[]) => s + c[0], 0) / coords.length;
      return [lat, lng];
    }
  }
  for (const f of features) {
    if (f.type === "POI" || f.type === "FACILITY") {
      const geom = f.geometry as { coordinates: [number, number] };
      return [geom.coordinates[1], geom.coordinates[0]];
    }
  }
  return [-7.400, 110.100];
}

// ─── Draw handler component (uses useMap) ─────────────────
interface DrawHandlerProps {
  featureType: string;
  geometry?: GeoJSON.Geometry | null;
  contextFeatures?: MapFeature[];
  onGeometryChange: (geometry: GeoJSON.Geometry | null) => void;
  locale: "id" | "en";
}

function DrawHandler({ featureType, geometry, contextFeatures = [], onGeometryChange, locale }: DrawHandlerProps) {
  const map = useMap();
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const drawControlRef = useRef<L.Control.Draw | null>(null);

  // Initialize drawn items layer
  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

    return () => {
      map.removeLayer(drawnItems);
    };
  }, [map]);

  // Load existing geometry
  useEffect(() => {
    const drawnItems = drawnItemsRef.current;
    if (!drawnItems) return;
    drawnItems.clearLayers();

    if (!geometry) return;

    const geoJsonLayer = L.geoJSON(geometry as GeoJSON.GeoJsonObject);
    geoJsonLayer.eachLayer((layer) => {
      drawnItems.addLayer(layer);
    });

    // Fit bounds to geometry
    const bounds = drawnItems.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 16 });
    }
  }, [geometry, map]);

  // Recreate draw control when featureType changes
  useEffect(() => {
    const drawnItems = drawnItemsRef.current;
    if (!drawnItems) return;

    // Remove old draw control
    if (drawControlRef.current) {
      map.removeControl(drawControlRef.current);
      drawControlRef.current = null;
    }

    // Configure draw options based on feature type
    const drawOptions: L.Control.DrawOptions = {};

    if (featureType === "BOUNDARY") {
      drawOptions.polygon = {
        allowIntersection: true,
        shapeOptions: {
          color: "#2D6A4F",
          weight: 3,
          fillColor: "#2D6A4F",
          fillOpacity: 0.2,
        },
      };
      drawOptions.polyline = false;
      drawOptions.marker = false;
      drawOptions.circlemarker = false;
      drawOptions.circle = false;
      drawOptions.rectangle = {
        shapeOptions: {
          color: "#2D6A4F",
          weight: 3,
          fillColor: "#2D6A4F",
          fillOpacity: 0.2,
        },
      };
    } else if (featureType === "POI" || featureType === "FACILITY") {
      drawOptions.marker = { icon: defaultIcon };
      drawOptions.polyline = false;
      drawOptions.polygon = false;
      drawOptions.circlemarker = false;
      drawOptions.circle = false;
      drawOptions.rectangle = false;
    } else if (featureType === "ROAD") {
      drawOptions.polyline = {
        shapeOptions: {
          color: "#E63946",
          weight: 4,
        },
      };
      drawOptions.polygon = false;
      drawOptions.marker = false;
      drawOptions.circlemarker = false;
      drawOptions.circle = false;
      drawOptions.rectangle = false;
    }

    const drawControl = new L.Control.Draw({
      position: "topright",
      draw: drawOptions,
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });

    map.addControl(drawControl);
    drawControlRef.current = drawControl;

    return () => {
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
        drawControlRef.current = null;
      }
    };
  }, [featureType, map]);

  // Event handlers
  useEffect(() => {
    const drawnItems = drawnItemsRef.current;
    if (!drawnItems) return;

    const onCreated = (e: L.LeafletEvent) => {
      const ev = e as L.DrawEvents.Created;
      // Clear previous drawings (only one feature at a time)
      drawnItems.clearLayers();
      drawnItems.addLayer(ev.layer);

      const geojson = drawnItems.toGeoJSON() as GeoJSON.FeatureCollection;
      const feature = geojson.features[0];
      if (feature) {
        onGeometryChange(feature.geometry as GeoJSON.Geometry);
      }
    };

    const onEdited = (e: L.LeafletEvent) => {
      const ev = e as L.DrawEvents.Edited;
      ev.layers.eachLayer(() => {
        const geojson = drawnItems.toGeoJSON() as GeoJSON.FeatureCollection;
        const feature = geojson.features[0];
        if (feature) {
          onGeometryChange(feature.geometry as GeoJSON.Geometry);
        }
      });
    };

    const onDeleted = () => {
      onGeometryChange(null);
    };

    map.on(L.Draw.Event.CREATED, onCreated);
    map.on(L.Draw.Event.EDITED, onEdited);
    map.on(L.Draw.Event.DELETED, onDeleted);

    return () => {
      map.off(L.Draw.Event.CREATED, onCreated);
      map.off(L.Draw.Event.EDITED, onEdited);
      map.off(L.Draw.Event.DELETED, onDeleted);
    };
  }, [map, onGeometryChange]);

  return null;
}

// ─── Main MapEditor component ─────────────────────────────
interface MapEditorProps {
  geometry?: GeoJSON.Geometry | null;
  featureType: "BOUNDARY" | "POI" | "ROAD" | "FACILITY";
  contextFeatures?: MapFeature[];
  onGeometryChange: (geometry: GeoJSON.Geometry | null) => void;
  locale: "id" | "en";
}

export function MapEditor({ geometry, featureType, contextFeatures = [], onGeometryChange, locale }: MapEditorProps) {
  const center = contextFeatures.length > 0 ? getCenter(contextFeatures) : [-7.400, 110.100] as [number, number];

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: "500px", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Context features (read-only, light gray) */}
      {contextFeatures.map((f) => {
        if (f.type === "BOUNDARY") {
          return (
            <GeoJSON
              key={f.id}
              data={{
                type: "Feature",
                geometry: f.geometry,
                properties: { name: locale === "id" ? f.nameId : f.nameEn },
              } as GeoJSON.Feature}
              style={{
                color: "#94a3b8",
                weight: 2,
                fillColor: "#94a3b8",
                fillOpacity: 0.05,
              }}
            />
          );
        }
        if (f.type === "POI" || f.type === "FACILITY") {
          const geom = f.geometry as { coordinates: [number, number] };
          const name = locale === "id" ? f.nameId : f.nameEn;
          return (
            <Marker
              key={f.id}
              position={[geom.coordinates[1], geom.coordinates[0]]}
              icon={createCustomIcon(f.icon)}
              opacity={0.5}
            >
              <Popup><div className="text-sm"><strong>{name}</strong></div></Popup>
            </Marker>
          );
        }
        return null;
      })}

      <DrawHandler
        featureType={featureType}
        geometry={geometry}
        contextFeatures={contextFeatures}
        onGeometryChange={onGeometryChange}
        locale={locale}
      />
    </MapContainer>
  );
}
