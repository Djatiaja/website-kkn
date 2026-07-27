"use client";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { materialSchema, type MaterialInput } from "@/lib/validations/material";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { MaterialDropzone } from "./MaterialDropzone";
import { FileTypeIcon } from "./FileTypeIcon";
import { FileSizeBadge } from "./FileSizeBadge";
import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import type { DigitalMaterial } from "@/types";

interface MaterialFormProps {
  initialData?: DigitalMaterial;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export function MaterialForm({
  initialData,
  onSubmit,
  isLoading,
}: MaterialFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [replaceFile, setReplaceFile] = useState(false);
  const [removeThumbnail, setRemoveThumbnail] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof materialSchema>>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      titleId: initialData?.titleId || "",
      titleEn: initialData?.titleEn || "",
      descriptionId: initialData?.descriptionId || "",
      descriptionEn: initialData?.descriptionEn || "",
      category: initialData?.category || "UMUM",
      isPublished: initialData?.isPublished ?? true,
    },
  });

  const category = watch("category");

  const onSubmitForm = (data: any) => {
    const formData = new FormData();
    formData.append("titleId", data.titleId);
    formData.append("titleEn", data.titleEn);
    if (data.descriptionId) formData.append("descriptionId", data.descriptionId);
    if (data.descriptionEn) formData.append("descriptionEn", data.descriptionEn);
    formData.append("category", data.category);
    formData.append("isPublished", String(data.isPublished));

    if (file) {
      formData.append("file", file);
    }
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    } else if (removeThumbnail && initialData) {
      formData.append("removeThumbnail", "true");
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input label="Judul (Indonesia)" {...register("titleId")} error={errors.titleId?.message} />
        </div>
        <div>
          <Input label="Judul (Inggris)" {...register("titleEn")} error={errors.titleEn?.message} />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Deskripsi (Indonesia)</label>
          <RichTextEditor
            value={watch("descriptionId") || ""}
            onChange={(val) => setValue("descriptionId", val)}
            placeholder="Deskripsi materi..."
          />
          {errors.descriptionId && <p className="text-xs text-error mt-1">{errors.descriptionId.message}</p>}
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Deskripsi (Inggris)</label>
          <RichTextEditor
            value={watch("descriptionEn") || ""}
            onChange={(val) => setValue("descriptionEn", val)}
            placeholder="Material description..."
          />
          {errors.descriptionEn && <p className="text-xs text-error mt-1">{errors.descriptionEn.message}</p>}
        </div>

        <div>
          <Select 
            label="Kategori" 
            value={category} 
            onChange={(val) => setValue("category", val as any)}
            options={[
              { value: "PENDIDIKAN", label: "Pendidikan" },
              { value: "KESEHATAN", label: "Kesehatan" },
              { value: "PERTANIAN", label: "Pertanian" },
              { value: "TEKNOLOGI", label: "Teknologi" },
              { value: "UMUM", label: "Umum" }
            ]}
          />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="isPublished" {...register("isPublished")} />
          <label htmlFor="isPublished">Publikasikan Materi</label>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">File Materi (PDF/DOC/VIDEO)</label>
          {initialData && !file && !replaceFile ? (
            <div className="relative flex items-center gap-4 rounded-lg border p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileTypeIcon type={initialData.fileType} className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-sm font-medium">{initialData.fileName}</span>
                <FileSizeBadge size={initialData.fileSize} />
              </div>
              <button
                type="button"
                onClick={() => setReplaceFile(true)}
                className="rounded-full p-1 hover:bg-muted"
                title="Ganti file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <MaterialDropzone onFileSelect={setFile} selectedFile={file} />
          )}
          {!file && !initialData && (
            <p className="text-sm text-red-500 mt-1">File wajib diunggah untuk materi baru</p>
          )}
          {replaceFile && !file && initialData && (
            <p className="text-sm text-muted-foreground mt-1">Pilih file baru untuk mengganti, atau <button type="button" className="text-primary underline" onClick={() => setReplaceFile(false)}>batal</button>.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Thumbnail (Opsional)</label>
          {initialData?.thumbnailUrl && !thumbnail && !removeThumbnail ? (
            <div className="relative flex items-center gap-4 rounded-lg border p-4">
              <div className="relative h-12 w-16 shrink-0 rounded overflow-hidden bg-muted">
                <Image src={initialData.thumbnailUrl} alt="Thumbnail" fill unoptimized className="object-cover" />
              </div>
              <span className="text-sm text-muted-foreground">Thumbnail saat ini</span>
              <button
                type="button"
                onClick={() => setRemoveThumbnail(true)}
                className="ml-auto rounded-full p-1 hover:bg-muted"
                title="Hapus thumbnail"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <MaterialDropzone onFileSelect={setThumbnail} selectedFile={thumbnail} />
          )}
          {removeThumbnail && (
            <p className="text-sm text-amber-600 mt-1">Thumbnail akan dihapus saat disimpan.</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Menyimpan..." : "Simpan Materi"}
      </Button>
    </form>
  );
}
