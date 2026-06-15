"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useGallery } from "@/hooks/useGallery";
import { Image as ImageIcon } from "lucide-react";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import type { GalleryItem } from "@/types";

const filters = ["all", "PHOTO", "VIDEO"] as const;

export function GalleryPageClient({ locale }: { locale: "id" | "en" }) {
  const t = useTranslations("gallery");
  const [type, setType] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { data, isLoading } = useGallery({
    type: type === "all" ? undefined : type as "PHOTO" | "VIDEO",
    page,
    pageSize: 12,
  });

  const hasMore = data ? page * data.pageSize < data.total : false;

  const selectedItem = selectedIndex !== null && data ? data.data[selectedIndex] : null;

  const nextImage = useCallback(() => {
    if (!data) return;
    setSelectedIndex((prev) => prev !== null ? (prev + 1) % data.data.length : null);
  }, [data]);

  const prevImage = useCallback(() => {
    if (!data) return;
    setSelectedIndex((prev) => prev !== null ? (prev - 1 + data.data.length) % data.data.length : null);
  }, [data]);

  const closeLightbox = () => setSelectedIndex(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, nextImage, prevImage]);

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedIndex]);

  return (
    <div className="pt-28 pb-20">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h1 className="flex items-center justify-center gap-3 text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-2">
              <ImageIcon className="w-8 h-8 text-primary" /> {t("title")}
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${type === f
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
                  <GalleryCard item={item} locale={locale} onClick={() => setSelectedIndex(idx)} />
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
          <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
            <ImageIcon className="w-16 h-16 mb-4 text-neutral-300" />
            <p>{t("empty")}</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && selectedItem && data && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm">
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 text-white/80">
            <div className="text-sm font-medium">
              {selectedIndex + 1} / {data.data.length}
            </div>
            <button onClick={closeLightbox} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors" aria-label="Tutup">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center relative px-4 md:px-16 overflow-hidden">
            {/* Nav Prev */}
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10" aria-label="Sebelumnya">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Content Container */}
            <div className="relative max-w-full max-h-full flex flex-col items-center justify-center w-full h-full py-8" onClick={(e) => e.stopPropagation()}>
              {selectedItem.type === "PHOTO" ? (
                 <img src={selectedItem.url} alt={locale === "id" ? selectedItem.titleId : selectedItem.titleEn} className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl" />
              ) : (
                 selectedItem.url.includes("youtube.com") || selectedItem.url.includes("youtu.be") ? (
                   <iframe src={selectedItem.url.replace("youtu.be/", "youtube.com/embed/").replace("watch?v=", "embed/")} className="w-full max-w-4xl aspect-video rounded-lg shadow-2xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                 ) : (
                   <video src={selectedItem.url} controls className="w-full max-w-4xl max-h-[75vh] rounded-lg shadow-2xl" />
                 )
              )}
              <div className="mt-4 text-center">
                <h3 className="text-white font-medium text-lg">{locale === "id" ? selectedItem.titleId : selectedItem.titleEn}</h3>
                {(locale === "id" ? selectedItem.descriptionId : selectedItem.descriptionEn) && (
                  <p className="text-white/80 text-sm mt-2 max-w-2xl mx-auto">{locale === "id" ? selectedItem.descriptionId : selectedItem.descriptionEn}</p>
                )}
              </div>
            </div>

            {/* Nav Next */}
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10" aria-label="Selanjutnya">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div className="hidden md:flex justify-center gap-2 pb-6 px-4 overflow-x-auto">
            {data.data.map((item, idx) => (
              <button key={item.id} onClick={() => setSelectedIndex(idx)} className={`flex-none relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${selectedIndex === idx ? "border-primary opacity-100 scale-105" : "border-transparent opacity-40 hover:opacity-100"}`}>
                <Image src={item.thumbnailUrl || item.url} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GalleryCard({ item, locale, onClick }: { item: GalleryItem; locale: "id" | "en"; onClick: () => void }) {
  const title = locale === "id" ? item.titleId : item.titleEn;

  return (
    <button
      onClick={onClick}
      className="group relative w-full block aspect-square rounded-xl overflow-hidden border border-neutral-200 hover:shadow-lg transition-all duration-300"
    >
      {item.type === "PHOTO" ? (
        <Image
          src={item.thumbnailUrl || item.url}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="relative w-full h-full bg-neutral-900 flex items-center justify-center">
          <Image
            src={item.thumbnailUrl || item.url}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
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
