"use client";

import { useState } from "react";
import { useGallery, useCreateGalleryItem, useDeleteGalleryItem } from "@/hooks/useGallery";
import { Button, Input, Select, Modal, Table, Pagination } from "@/components/ui";
import type { GalleryItem } from "@/types";
import { api } from "@/lib/api";

const typeOptions = [
  { value: "PHOTO", label: "Foto" },
  { value: "VIDEO", label: "Video" },
];

interface FormData {
  titleId: string;
  titleEn: string;
  descriptionId: string;
  descriptionEn: string;
  type: string;
  url: string;
  thumbnailUrl: string;
  category: string;
}

const emptyForm: FormData = {
  titleId: "",
  titleEn: "",
  descriptionId: "",
  descriptionEn: "",
  type: "PHOTO",
  url: "",
  thumbnailUrl: "",
  category: "",
};

export default function AdminGaleriPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const { data, isLoading, refetch } = useGallery({ page, pageSize: 10 });
  const createGallery = useCreateGalleryItem();
  const deleteGallery = useDeleteGalleryItem();

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1;

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item: GalleryItem) => {
    setEditId(item.id);
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
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

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

    if (editId) {
      await api.put(`/gallery/${editId}`, payload);
    } else {
      await api.post("/gallery", payload);
    }

    setSaving(false);
    setModalOpen(false);
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus item ini?")) return;
    deleteGallery.mutate(id);
  };

  const columns = [
    { key: "titleId", header: "Judul" },
    { key: "type", header: "Tipe" },
    { key: "category", header: "Kategori" },
    {
      key: "actions",
      header: "Aksi",
      render: (row: GalleryItem) => (
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
        <h1 className="text-2xl font-heading font-bold">Kelola Galeri</h1>
        <Button onClick={openCreate}>+ Tambah Item</Button>
      </div>

      <Table columns={columns as never} data={(data?.data || []) as never} isLoading={isLoading} emptyMessage="Belum ada item galeri" />

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Item" : "Tambah Item"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Judul (ID)" value={form.titleId} onChange={(e) => setForm({ ...form, titleId: e.target.value })} required />
          <Input label="Judul (EN)" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} required />
          <Select label="Tipe" value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={typeOptions} />
          <Input label="URL File" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} required />
          <Input label="URL Thumbnail" value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} />
          <Input label="Deskripsi (ID)" value={form.descriptionId} onChange={(e) => setForm({ ...form, descriptionId: e.target.value })} />
          <Input label="Deskripsi (EN)" value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
          <Input label="Kategori" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="mis: kegiatan, alam, budaya" />
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={saving}>{editId ? "Simpan" : "Tambah"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
