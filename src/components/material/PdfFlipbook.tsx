"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PdfFlipbookProps {
  url: string;
}

export function PdfFlipbook({ url }: PdfFlipbookProps) {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const bookRef = useRef<any>(null);

  const renderPdf = useCallback(async () => {
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";
      const doc = await pdfjsLib.getDocument({ url }).promise;
      const numPages = doc.numPages;
      setTotalPages(numPages);

      const rendered: string[] = [];
      for (let i = 1; i <= numPages; i++) {
        const page = await doc.getPage(i);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas, viewport }).promise;
        rendered.push(canvas.toDataURL("image/jpeg", 0.85));
      }
      setPages(rendered);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    renderPdf();
  }, [renderPdf]);

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="aspect-[3/4] w-full rounded-lg border bg-neutral-100 animate-pulse flex items-center justify-center">
          <svg className="h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
        </div>
        <div className="flex justify-center gap-2 mt-3">
          <div className="h-3 w-16 rounded bg-neutral-200 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || pages.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg border bg-muted">
        <p className="text-sm text-muted-foreground">Gagal memuat pratinjau PDF.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-3xl">
        <HTMLFlipBook
          ref={bookRef}
          width={600}
          height={848}
          size="stretch"
          minWidth={300}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1400}
          startPage={0}
          startZIndex={0}
          showCover
          drawShadow
          flippingTime={600}
          usePortrait
          autoSize
          maxShadowOpacity={0.4}
          mobileScrollSupport
          showPageCorners
          disableFlipByClick={false}
          clickEventForward
          useMouseEvents
          swipeDistance={30}
          onFlip={(e: any) => setCurrentPage(e.data)}
          className="mx-auto"
          style={{ margin: "0 auto" }}
        >
          {pages.map((src, i) => (
            <div key={i} className="bg-white border border-neutral-200 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Page ${i + 1}`}
                className="h-full w-full object-contain"
                draggable={false}
              />
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => bookRef.current?.pageFlip().flipPrev()}
            disabled={currentPage === 0}
            className="rounded-full p-2 hover:bg-muted disabled:opacity-30 transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm text-muted-foreground font-medium">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => bookRef.current?.pageFlip().flipNext()}
            disabled={currentPage >= totalPages - 1}
            className="rounded-full p-2 hover:bg-muted disabled:opacity-30 transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
