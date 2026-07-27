"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNewsList, useDeleteNews } from "@/hooks/useNews";
import { Button, Input, Table, Badge, Pagination } from "@/components/ui";
import type { News } from "@/types";

export default function AdminBeritaPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useNewsList({ page, pageSize: 10, search: search || undefined });
  const deleteNews = useDeleteNews();

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1;

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
          <Button size="sm" variant="secondary" onClick={() => router.push(`/admin/berita/form?id=${row.id}`)}>
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
        <Button onClick={() => router.push("/admin/berita/form")}>+ Tambah Berita</Button>
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
    </div>
  );
}
