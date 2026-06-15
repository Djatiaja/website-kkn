"use client";

import { useState, useEffect, useCallback } from "react";

interface LightboxGalleryProps {
  images: string[];
  title?: string;
  columns?: "2" | "3" | "4";
}

export function LightboxGallery({ images, title = "Galeri", columns = "3" }: LightboxGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => setIsOpen(false);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextImage, prevImage]);

  // Prevent scrolling when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const columnsClass = {
    "2": "columns-1 sm:columns-2",
    "3": "columns-2 sm:columns-3",
    "4": "columns-2 sm:columns-3 lg:columns-4",
  }[columns];

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* Masonry Grid */}
      <div className={`${columnsClass} gap-4`}>
        {images.map((img, idx) => (
          <div
            key={idx}
            className="mb-4 break-inside-avoid relative rounded-xl overflow-hidden group cursor-pointer border border-neutral-200 bg-neutral-100"
            onClick={() => openLightbox(idx)}
          >
            <img
              src={img}
              alt={`${title} - Foto ${idx + 1}`}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                width="32"
                height="32"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300"
              >
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm">
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 text-white/80">
            <div className="text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
            <button
              onClick={closeLightbox}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Tutup"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center relative px-4 md:px-16 overflow-hidden">
            {/* Nav Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
              aria-label="Sebelumnya"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Image Container */}
            <div className="relative max-w-full max-h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={images[currentIndex]}
                alt={`${title} - Foto ${currentIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="mt-4 text-center">
                <h3 className="text-white font-medium text-lg">{title}</h3>
                <p className="text-white/60 text-sm mt-1">Foto {currentIndex + 1} dari {images.length}</p>
              </div>
            </div>

            {/* Nav Next */}
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
              aria-label="Selanjutnya"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Thumbnail Strip (Optional) */}
          <div className="hidden md:flex justify-center gap-2 pb-6 px-4 overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`flex-none w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                  currentIndex === idx ? "border-primary opacity-100 scale-105" : "border-transparent opacity-40 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
