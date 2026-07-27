"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGallery, useDeleteGalleryItem } from "@/hooks/useGallery";
import { Button, Table, Pagination, Badge } from "@/components/ui";
import type { GalleryItem } from "@/types";

export default function AdminGaleriPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGallery({ page, pageSize: 10 });
  const deleteGallery = useDeleteGalleryItem();

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1;

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
          <Button size="sm" variant="secondary" onClick={() => router.push(`/admin/galeri/form?id=${row.id}`)}>
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
        <Button onClick={() => router.push("/admin/galeri/form")}>+ Tambah Item</Button>
      </div>

      <Table columns={columns as never} data={(data?.data || []) as never} isLoading={isLoading} emptyMessage="Belum ada item galeri" />

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
