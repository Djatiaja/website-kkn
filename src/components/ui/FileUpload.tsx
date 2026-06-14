"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onUpload: (files: File[]) => void;
  isUploading?: boolean;
  preview?: boolean;
  className?: string;
}

function FileUpload({
  accept = "image/*",
  multiple = false,
  maxSize = 10_000_000,
  onUpload,
  isUploading = false,
  preview = true,
  className,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const validFiles = Array.from(files).filter((f) => f.size <= maxSize);
      if (validFiles.length === 0) return;

      if (preview) {
        const urls = validFiles.map((f) => URL.createObjectURL(f));
        setPreviews(urls);
      }

      onUpload(validFiles);
    },
    [maxSize, onUpload, preview]
  );

  return (
    <div className={cn("w-full", className)}>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-neutral-300 hover:border-primary/50 hover:bg-neutral-50",
          isUploading && "opacity-50 pointer-events-none"
        )}
      >
        <div className="text-3xl">📁</div>
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-700">
            Seret & lepas file di sini
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            atau klik untuk memilih • Maks {(maxSize / 1_000_000).toFixed(0)}MB
          </p>
        </div>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {isUploading && (
          <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-full rounded-full animate-pulse w-2/3" />
          </div>
        )}
      </label>

      {/* Previews */}
      {preview && previews.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {previews.map((url, idx) => (
            <div
              key={idx}
              className="w-20 h-20 rounded-lg overflow-hidden border border-neutral-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Preview ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { FileUpload };
export type { FileUploadProps };
