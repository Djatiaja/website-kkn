"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Select, RichTextEditor, ImageUploader } from "@/components/ui";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { News } from "@/types";

const categoryOptions = [
  { value: "PENGUMUMAN", label: "Pengumuman" },
  { value: "KEGIATAN", label: "Kegiatan" },
  { value: "PEMBANGUNAN", label: "Pembangunan" },
  { value: "UMUM", label: "Umum" },
];

export default function AdminBeritaFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    titleId: "",
    titleEn: "",
    slug: "",
    contentId: "",
    contentEn: "",
    excerptId: "",
    excerptEn: "",
    coverImageUrl: "",
    category: "UMUM",
    isPublished: false,
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get<News>(`/news/${id}`).then((n) => {
        setForm({
          titleId: n.titleId,
          titleEn: n.titleEn,
          slug: n.slug,
          contentId: n.contentId,
          contentEn: n.contentEn,
          excerptId: n.excerptId || "",
          excerptEn: n.excerptEn || "",
          coverImageUrl: n.coverImageUrl || "",
          category: n.category,
          isPublished: n.isPublished,
        });
        setLoading(false);
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      slug: form.slug || form.titleId.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      publishedAt: form.isPublished ? new Date().toISOString() : null,
    };

    try {
      if (id) {
        await api.put(`/news/${id}`, payload);
        toast.success("Berita diperbarui");
      } else {
        await api.post("/news", payload);
        toast.success("Berita ditambahkan");
      }
      router.push("/admin/berita");
    } catch (err) {
      toast.error("Gagal menyimpan berita");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{id ? "Edit Berita" : "Tambah Berita"}</h1>
        <Button variant="secondary" onClick={() => router.push("/admin/berita")}>Kembali</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Judul (ID)" value={form.titleId} onChange={(e) => setForm({ ...form, titleId: e.target.value })} required />
          <Input label="Judul (EN)" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} required />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="Slug (opsional)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Dikosongkan untuk generate otomatis" />
          <Select label="Kategori" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={categoryOptions} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="Ringkasan (ID)" value={form.excerptId} onChange={(e) => setForm({ ...form, excerptId: e.target.value })} />
          <Input label="Ringkasan (EN)" value={form.excerptEn} onChange={(e) => setForm({ ...form, excerptEn: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Konten (ID)</label>
          <RichTextEditor value={form.contentId} onChange={(val) => setForm({ ...form, contentId: val })} folder="news" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Konten (EN)</label>
          <RichTextEditor value={form.contentEn} onChange={(val) => setForm({ ...form, contentEn: val })} folder="news" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Gambar Cover</label>
          <ImageUploader value={form.coverImageUrl} onChange={(url) => setForm({ ...form, coverImageUrl: url })} folder="news" />
        </div>
        
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isPublished" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="w-4 h-4" />
          <label htmlFor="isPublished">Publikasikan</label>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button type="submit" isLoading={loading}>{id ? "Simpan Perubahan" : "Simpan Berita"}</Button>
        </div>
      </form>
    </div>
  );
}
