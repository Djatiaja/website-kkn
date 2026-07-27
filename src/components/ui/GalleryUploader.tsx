"use client";

import { useCallback, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GalleryUploaderProps {
  value: string;          // newline-separated URLs
  onChange: (val: string) => void;
  folder?: string;
  maxSize?: number;
  className?: string;
}

export function GalleryUploader({
  value,
  onChange,
  folder = "products",
  maxSize = 10_000_000,
  className,
}: GalleryUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const urls = value ? value.split("\n").map(s => s.trim()).filter(Boolean) : [];

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const mode = process.env.NEXT_PUBLIC_UPLOAD_MODE;
      setUploading(true);

      const newUrls: string[] = [];

      for (const file of Array.from(files)) {
        if (file.size > maxSize) {
          toast.error(`${file.name} terlalu besar`);
          continue;
        }

        if (mode === "blob") {
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          newUrls.push(dataUrl);
        } else {
          try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", folder);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            if (!res.ok) throw new Error("Upload gagal");
            const data = await res.json();
            newUrls.push(data.url);
          } catch {
            toast.error(`Gagal mengunggah ${file.name}`);
          }
        }
      }

      const allUrls = [...urls, ...newUrls];
      onChange(allUrls.join("\n"));
      setUploading(false);
    },
    [folder, maxSize, onChange, urls]
  );

  const removeUrl = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    onChange(newUrls.join("\n"));
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Thumbnails */}
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {urls.map((url, i) => (
            <div key={i} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Galeri ${i + 1}`}
                className="w-20 h-20 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removeUrl(i)}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <label
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-xl cursor-pointer transition-all text-sm",
          "border-neutral-300 hover:border-primary/50 hover:bg-neutral-50",
          uploading && "opacity-50 pointer-events-none"
        )}
      >
        {uploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ImagePlus className="w-4 h-4" />
        )}
        {uploading ? "Mengunggah..." : "Tambah Gambar"}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
    </div>
  );
}
