"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import type { MapFeature } from "@/types";

const VillageMap = dynamic(() => import("@/components/map/VillageMap").then(m => m.VillageMap), {
  ssr: false,
  loading: () => (
    <div className="h-[70vh] bg-neutral-100 rounded-2xl flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
    </div>
  ),
});

const LocationList = dynamic(() => import("@/components/map/LocationList").then(m => m.LocationList), {
  ssr: false,
});

export function MapPageClient({ locale }: { locale: "id" | "en" }) {
  const t = useTranslations("map");
  const [features, setFeatures] = useState<MapFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);

  useEffect(() => {
    api.get<MapFeature[]>("/map?isVisible=true").then((data) => {
      setFeatures(data);
      setLoading(false);
    });
  }, []);

  const handleLocationClick = (coords: [number, number]) => {
    setFlyTo(coords);
  };

  return (
    <div className="pt-28 pb-20">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-2">
              🗺️ {t("title")}
            </h1>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
            {loading ? (
              <div className="h-[70vh] bg-neutral-100 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <VillageMap features={features} locale={locale} flyTo={flyTo} />
            )}
          </div>
        </ScrollReveal>

        {/* Location List */}
        <ScrollReveal delay={200}>
          <div className="mt-12">
            <h2 className="text-xl font-heading font-bold text-neutral-900 mb-6">
              {t("locations.title")}
            </h2>
            <LocationList
              features={features.filter(f => f.type !== "BOUNDARY")}
              locale={locale}
              onLocationClick={handleLocationClick}
            />
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
