"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Select, RichTextEditor, ImageUploader } from "@/components/ui";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { GalleryItem } from "@/types";

const typeOptions = [
  { value: "PHOTO", label: "Foto" },
  { value: "VIDEO", label: "Video" },
];

export default function AdminGaleriFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    titleId: "",
    titleEn: "",
    descriptionId: "",
    descriptionEn: "",
    type: "PHOTO",
    url: "",
    thumbnailUrl: "",
    category: "",
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get<GalleryItem>(`/gallery/${id}`).then((item) => {
        setForm({
          titleId: item.titleId,
          titleEn: item.titleEn,
          descriptionId: item.descriptionId || "",
          descriptionEn: item.descriptionEn || "",
          type: item.type,
          url: item.url,
          thumbnailUrl: item.thumbnailUrl || "",
          category: item.category || "",
        });
        setLoading(false);
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      titleId: form.titleId,
      titleEn: form.titleEn,
      descriptionId: form.descriptionId || null,
      descriptionEn: form.descriptionEn || null,
      type: form.type,
      url: form.url,
      thumbnailUrl: form.thumbnailUrl || null,
      category: form.category || null,
    };

    try {
      if (id) {
        await api.put(`/gallery/${id}`, payload);
        toast.success("Item galeri diperbarui");
      } else {
        await api.post("/gallery", payload);
        toast.success("Item galeri ditambahkan");
      }
      router.push("/admin/galeri");
    } catch {
      toast.error("Gagal menyimpan item galeri");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{id ? "Edit Item Galeri" : "Tambah Item Galeri"}</h1>
        <Button variant="secondary" onClick={() => router.push("/admin/galeri")}>Kembali</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Judul (ID)" value={form.titleId} onChange={(e) => setForm({ ...form, titleId: e.target.value })} required />
          <Input label="Judul (EN)" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select label="Tipe" value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={typeOptions} />
          <Input label="Kategori" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="mis: kegiatan, alam, budaya" />
        </div>

        {form.type === "PHOTO" ? (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Gambar</label>
            <ImageUploader value={form.url} onChange={(url) => setForm({ ...form, url })} folder="gallery" />
          </div>
        ) : (
          <Input label="URL Video" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} required />
        )}

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Thumbnail</label>
          <ImageUploader value={form.thumbnailUrl} onChange={(url) => setForm({ ...form, thumbnailUrl: url })} folder="gallery" />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Deskripsi (ID)</label>
          <RichTextEditor value={form.descriptionId} onChange={(val) => setForm({ ...form, descriptionId: val })} folder="gallery" />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Deskripsi (EN)</label>
          <RichTextEditor value={form.descriptionEn} onChange={(val) => setForm({ ...form, descriptionEn: val })} folder="gallery" />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" isLoading={loading}>{id ? "Simpan Perubahan" : "Simpan"}</Button>
        </div>
      </form>
    </div>
  );
}
