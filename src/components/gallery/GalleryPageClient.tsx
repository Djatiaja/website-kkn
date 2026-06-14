"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useGallery } from "@/hooks/useGallery";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { Modal } from "@/components/ui";
import type { GalleryItem } from "@/types";

const filters = ["all", "PHOTO", "VIDEO"] as const;

export function GalleryPageClient({ locale }: { locale: "id" | "en" }) {
  const t = useTranslations("gallery");
  const [type, setType] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const { data, isLoading } = useGallery({
    type: type === "all" ? undefined : type as "PHOTO" | "VIDEO",
    page,
    pageSize: 12,
  });

  const hasMore = data ? page * data.pageSize < data.total : false;

  return (
    <div className="pt-28 pb-20">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-2">
              🖼️ {t("title")}
            </h1>
          </div>
        </ScrollReveal>

        {/* Filter */}
        <ScrollReveal delay={100}>
          <div className="flex justify-center gap-2 mb-10">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => { setType(f); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  type === f
                    ? "bg-primary text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {t(`filter.${f.toLowerCase()}`)}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-neutral-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.data.map((item, idx) => (
                <ScrollReveal key={item.id} delay={idx * 30}>
                  <GalleryCard item={item} locale={locale} onClick={() => setSelected(item)} />
                </ScrollReveal>
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  {t("load_more")}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 text-neutral-500">
            <p className="text-5xl mb-4">🖼️</p>
            <p>{t("empty")}</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected ? (locale === "id" ? selected.titleId : selected.titleEn) : ""}>
        {selected && (
          <div>
            {selected.type === "PHOTO" ? (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image src={selected.url} alt={locale === "id" ? selected.titleId : selected.titleEn} fill className="object-contain" />
              </div>
            ) : (
              <video src={selected.url} controls className="w-full rounded-lg" />
            )}
            {(locale === "id" ? selected.descriptionId : selected.descriptionEn) && (
              <p className="mt-4 text-sm text-neutral-600">
                {locale === "id" ? selected.descriptionId : selected.descriptionEn}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function GalleryCard({ item, locale, onClick }: { item: GalleryItem; locale: "id" | "en"; onClick: () => void }) {
  const title = locale === "id" ? item.titleId : item.titleEn;

  return (
    <button
      onClick={onClick}
      className="group relative aspect-square rounded-xl overflow-hidden border border-neutral-200 hover:shadow-lg transition-all duration-300"
    >
      {item.type === "PHOTO" ? (
        <Image
          src={item.thumbnailUrl || item.url}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="relative w-full h-full bg-neutral-900 flex items-center justify-center">
          <Image
            src={item.thumbnailUrl || item.url}
            alt={title}
            fill
            className="object-cover opacity-60"
          />
          <span className="absolute text-4xl">▶️</span>
        </div>
      )}
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white text-sm font-medium truncate">{title}</p>
        </div>
      </div>
    </button>
  );
}
