"use client";

import { useCallback, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploaderProps {
  value?: string;              // current URL or base64
  onChange: (url: string) => void;
  folder?: string;             // upload subfolder (storage mode)
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder = "images",
  accept = "image/*",
  maxSize = 10_000_000,
  className,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.size > maxSize) {
        toast.error(`File terlalu besar. Maks ${(maxSize / 1_000_000).toFixed(0)}MB`);
        return;
      }

      const mode = process.env.NEXT_PUBLIC_UPLOAD_MODE;
      if (mode === "blob") {
        // Base64 mode
        const reader = new FileReader();
        reader.onload = (e) => {
          onChange(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // Storage mode — upload to server
        setUploading(true);
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", folder);
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          if (!res.ok) throw new Error("Upload gagal");
          const data = await res.json();
          onChange(data.url);
        } catch {
          toast.error("Gagal mengunggah gambar");
        } finally {
          setUploading(false);
        }
      }
    },
    [folder, maxSize, onChange]
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.[0]) return;
      handleFile(files[0]);
    },
    [handleFile]
  );

  return (
    <div className={cn("w-full", className)}>
      {value ? (
        <div className="relative group w-full max-w-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg border"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 max-w-xs",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-neutral-300 hover:border-primary/50 hover:bg-neutral-50",
            uploading && "opacity-50 pointer-events-none"
          )}
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
          ) : (
            <ImagePlus className="w-6 h-6 text-neutral-400" />
          )}
          <p className="text-sm text-neutral-600">
            {uploading ? "Mengunggah..." : "Klik atau seret gambar"}
          </p>
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      )}
    </div>
  );
}
