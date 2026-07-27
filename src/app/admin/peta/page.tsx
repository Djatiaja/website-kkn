"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button, Table, Toggle, Badge } from "@/components/ui";
import type { MapFeature } from "@/types";

export default function AdminPetaPage() {
  const router = useRouter();
  const [features, setFeatures] = useState<MapFeature[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeatures = async () => {
    setLoading(true);
    const data = await api.get<MapFeature[]>("/map");
    setFeatures(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeatures().catch(console.error);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus lokasi ini?")) return;
    await api.delete(`/map/${id}`);
    fetchFeatures().catch(console.error);
  };

  const toggleVisibility = async (f: MapFeature) => {
    await api.put(`/map/${f.id}`, { isVisible: !f.isVisible });
    fetchFeatures().catch(console.error);
  };

  const columns = [
    { key: "nameId", header: "Nama" },
    { key: "type", header: "Tipe" },
    {
      key: "isVisible",
      header: "Tampil",
      render: (row: MapFeature) => (
        <Toggle checked={row.isVisible} onChange={() => toggleVisibility(row)} />
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      render: (row: MapFeature) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => router.push(`/admin/peta/form?id=${row.id}`)}>
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
        <h1 className="text-2xl font-heading font-bold">Kelola Peta Desa</h1>
        <Button onClick={() => router.push("/admin/peta/form")}>+ Tambah Lokasi</Button>
      </div>

      <Table columns={columns as never} data={features as never} isLoading={loading} emptyMessage="Belum ada data lokasi" />
    </div>
  );
}
