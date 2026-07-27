"use client";

import dynamic from "next/dynamic";
import { DigitalMaterial } from "@/types";

const PdfFlipbook = dynamic(() => import("./PdfFlipbook").then(m => ({ default: m.PdfFlipbook })), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-3xl mx-auto">
      <div className="aspect-[3/4] w-full rounded-lg border bg-neutral-100 animate-pulse flex items-center justify-center">
        <svg className="h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
      </div>
      <div className="flex justify-center gap-2 mt-3">
        <div className="h-3 w-16 rounded bg-neutral-200 animate-pulse" />
      </div>
    </div>
  ),
});

export function MaterialPreview({ material }: { material: DigitalMaterial }) {
  if (material.fileType === "PDF") {
    return <PdfFlipbook url={material.fileUrl} />;
  }

  if (material.fileType === "IMAGE") {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={material.fileUrl}
          alt={material.titleId}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  if (material.fileType === "VIDEO") {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-black">
        <video
          src={material.fileUrl}
          controls
          className="h-full w-full"
        />
      </div>
    );
  }

  // DOC/OTHER: no preview
  return null;
}
