"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button, Table, Toggle } from "@/components/ui";
import { Map, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
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

  const boundaries = features.filter((f) => f.type === "BOUNDARY");
  const otherFeatures = features.filter((f) => f.type !== "BOUNDARY");

  const otherColumns = [
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold">Kelola Peta Desa</h1>
        <Button onClick={() => router.push("/admin/peta/form")}>+ Tambah Lokasi</Button>
      </div>

      {/* ─── Batas Wilayah (Boundary) Segment ─────────────── */}
      <section className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Map className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold text-neutral-900">Batas Wilayah</h2>
              <p className="text-xs text-neutral-500">Polygon yang mendefinisikan batas dusun & wilayah desa</p>
            </div>
          </div>
          <Button size="sm" onClick={() => router.push("/admin/peta/form?type=BOUNDARY")}>
            <Plus className="w-4 h-4 mr-1" /> Tambah Batas Wilayah
          </Button>
        </div>

        {loading ? (
          <div className="px-6 py-12 flex justify-center">
            <div className="animate-spin w-6 h-6 border-3 border-primary border-t-transparent rounded-full" />
          </div>
        ) : boundaries.length === 0 ? (
          <div className="px-6 py-12 text-center text-neutral-400">
            <Map className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Belum ada batas wilayah. Klik &quot;Tambah Batas Wilayah&quot; untuk mulai menggambar.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {boundaries.map((b) => {
              const name = b.nameId;
              return (
                <div key={b.id} className="flex items-center justify-between px-6 py-3 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{name}</p>
                      {b.nameEn && <p className="text-xs text-neutral-400 truncate">{b.nameEn}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleVisibility(b)}
                      className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors"
                      title={b.isVisible ? "Sembunyikan" : "Tampilkan"}
                    >
                      {b.isVisible
                        ? <Eye className="w-4 h-4 text-neutral-500" />
                        : <EyeOff className="w-4 h-4 text-neutral-300" />}
                    </button>
                    <button
                      onClick={() => router.push(`/admin/peta/form?id=${b.id}`)}
                      className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4 text-neutral-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-1.5 rounded-md hover:bg-red-50 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ─── Titik Lokasi & Lainnya Segment ───────────────── */}
      <section className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div>
            <h2 className="text-lg font-heading font-bold text-neutral-900">Titik Lokasi &amp; Lainnya</h2>
            <p className="text-xs text-neutral-500">POI, Fasilitas Umum, dan Jalan</p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => router.push("/admin/peta/form")}>
            <Plus className="w-4 h-4 mr-1" /> Tambah Lokasi
          </Button>
        </div>

        <Table columns={otherColumns as never} data={otherFeatures as never} isLoading={loading} emptyMessage="Belum ada data lokasi" />
      </section>
    </div>
  );
}
