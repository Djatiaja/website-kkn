"use client";

import { useState } from "react";
import { useMaterials } from "@/hooks/useMaterials";
import { MaterialGrid } from "@/components/material/MaterialGrid";
import { MaterialCard } from "@/components/material/MaterialCard";
import { MaterialFilter } from "@/components/material/MaterialFilter";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { MaterialFilters } from "@/lib/validations/material";

function MaterialCardSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl border bg-card">
      <Skeleton className="aspect-video rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="p-4 pt-0 flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function MaterialPageClient({ locale }: { locale: "id" | "en" }) {
  const t = useTranslations("materials");
  const [filters, setFilters] = useState<MaterialFilters>({
    page: 1,
    sortBy: "createdAt",
    sortOrder: "desc",
    pageSize: 12,
  });

  const { data: response, isLoading } = useMaterials(filters);

  const handleFilterChange = (newFilters: Partial<MaterialFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">{t("title")}</h1>
        <p className="text-lg text-neutral-600 max-w-2xl">
          {locale === "id" 
            ? "Jelajahi berbagai materi digital, dokumen, dan panduan yang tersedia."
            : "Explore various digital materials, documents, and guides available."}
        </p>
      </div>

      <div className="mb-8">
        <MaterialFilter filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {isLoading ? (
        <MaterialGrid>
          {Array.from({ length: 8 }).map((_, i) => (
            <MaterialCardSkeleton key={i} />
          ))}
        </MaterialGrid>
      ) : response?.data.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 text-center p-8">
          <p className="text-neutral-500 font-medium text-lg">{t("noResults")}</p>
        </div>
      ) : (
        <div className="space-y-12">
          <MaterialGrid>
            {response?.data.map((material) => (
              <MaterialCard key={material.id} material={material} locale={locale} />
            ))}
          </MaterialGrid>

          {response && response.total > response.pageSize && (
            <div className="flex justify-center border-t border-neutral-200 pt-8">
              <div className="flex items-center gap-2 bg-white rounded-full p-1 border shadow-sm">
                <Button
                  variant="ghost"
                  className="rounded-full px-6"
                  disabled={filters.page === 1}
                  onClick={() => setFilters((prev) => ({ ...prev, page: prev.page! - 1 }))}
                >
                  {locale === "id" ? "Sebelumnya" : "Previous"}
                </Button>
                <div className="flex items-center px-4 font-medium text-neutral-600">
                  {filters.page} / {Math.ceil(response.total / response.pageSize)}
                </div>
                <Button
                  variant="ghost"
                  className="rounded-full px-6"
                  disabled={filters.page === Math.ceil(response.total / response.pageSize)}
                  onClick={() => setFilters((prev) => ({ ...prev, page: prev.page! + 1 }))}
                >
                  {locale === "id" ? "Selanjutnya" : "Next"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
