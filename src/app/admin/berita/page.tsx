"use client";

import { useState } from "react";
import { useNewsList, useDeleteNews } from "@/hooks/useNews";
import { Button, Input, Select, Modal, Table, Badge, Pagination } from "@/components/ui";
import type { News } from "@/types";
import { api } from "@/lib/api";

const categoryOptions = [
  { value: "PENGUMUMAN", label: "Pengumuman" },
  { value: "KEGIATAN", label: "Kegiatan" },
  { value: "PEMBANGUNAN", label: "Pembangunan" },
  { value: "UMUM", label: "Umum" },
];

interface FormData {
  titleId: string;
  titleEn: string;
  slug: string;
  contentId: string;
  contentEn: string;
  excerptId: string;
  excerptEn: string;
  coverImageUrl: string;
  category: string;
  isPublished: boolean;
}

const emptyForm: FormData = {
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
};

export default function AdminBeritaPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const { data, isLoading, refetch } = useNewsList({ page, pageSize: 10, search: search || undefined });
  const deleteNews = useDeleteNews();

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1;

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (n: News) => {
    setEditId(n.id);
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
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      titleId: form.titleId,
      titleEn: form.titleEn,
      slug: form.slug || form.titleId.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      contentId: form.contentId,
      contentEn: form.contentEn,
      excerptId: form.excerptId || null,
      excerptEn: form.excerptEn || null,
      coverImageUrl: form.coverImageUrl || null,
      category: form.category,
      isPublished: form.isPublished,
      publishedAt: form.isPublished ? new Date().toISOString() : null,
    };

    if (editId) {
      await api.put(`/news/${editId}`, payload);
    } else {
      await api.post("/news", payload);
    }

    setSaving(false);
    setModalOpen(false);
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;
    deleteNews.mutate(id);
  };

  const columns = [
    { key: "titleId", header: "Judul" },
    {
      key: "category",
      header: "Kategori",
      render: (row: News) => <Badge variant="info">{row.category}</Badge>,
    },
    {
      key: "isPublished",
      header: "Status",
      render: (row: News) => (
        <Badge variant={row.isPublished ? "success" : "neutral"}>
          {row.isPublished ? "Terbit" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "publishedAt",
      header: "Tanggal",
      render: (row: News) =>
        row.publishedAt
          ? new Date(row.publishedAt).toLocaleDateString("id-ID")
          : "-",
    },
    {
      key: "actions",
      header: "Aksi",
      render: (row: News) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => openEdit(row)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Kelola Berita</h1>
        <Button onClick={openCreate}>+ Tambah Berita</Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Cari berita..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <Table columns={columns as never} data={(data?.data || []) as never} isLoading={isLoading} emptyMessage="Belum ada berita" />

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Berita" : "Tambah Berita"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Judul (ID)" value={form.titleId} onChange={(e) => setForm({ ...form, titleId: e.target.value })} required />
          <Input label="Judul (EN)" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} required />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generate jika kosong" />
          <Select label="Kategori" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={categoryOptions} />
          <Input label="Ringkasan (ID)" value={form.excerptId} onChange={(e) => setForm({ ...form, excerptId: e.target.value })} />
          <Input label="Ringkasan (EN)" value={form.excerptEn} onChange={(e) => setForm({ ...form, excerptEn: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Konten (ID)</label>
            <textarea className="w-full h-32 p-3 border border-neutral-300 rounded-lg text-sm" value={form.contentId} onChange={(e) => setForm({ ...form, contentId: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Konten (EN)</label>
            <textarea className="w-full h-32 p-3 border border-neutral-300 rounded-lg text-sm" value={form.contentEn} onChange={(e) => setForm({ ...form, contentEn: e.target.value })} required />
          </div>
          <Input label="URL Gambar Cover" value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isPublished" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            <label htmlFor="isPublished" className="text-sm">Publikasikan</label>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={saving}>{editId ? "Simpan" : "Tambah"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
