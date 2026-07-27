"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Select, Toggle, RichTextEditor } from "@/components/ui";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { MapFeature } from "@/types";

const typeOptions = [
  { value: "BOUNDARY", label: "Batas Wilayah" },
  { value: "POI", label: "Titik Lokasi" },
  { value: "FACILITY", label: "Fasilitas Umum" },
  { value: "ROAD", label: "Jalan" },
];

const iconOptions = [
  { value: "", label: "Tidak ada" },
  { value: "building", label: "🏛️ Gedung" },
  { value: "school", label: "🏫 Sekolah" },
  { value: "mosque", label: "🕌 Masjid" },
  { value: "hospital", label: "🏥 Puskesmas" },
  { value: "waterfall", label: "💧 Air Terjun" },
];

export default function AdminPetaFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nameId: "",
    nameEn: "",
    type: "POI",
    icon: "",
    descriptionId: "",
    descriptionEn: "",
    geometry: '{"type":"Point","coordinates":[106.838,-6.730]}',
    isVisible: true,
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get<MapFeature>(`/map/${id}`).then((f) => {
        setForm({
          nameId: f.nameId,
          nameEn: f.nameEn,
          type: f.type,
          icon: f.icon || "",
          descriptionId: f.descriptionId || "",
          descriptionEn: f.descriptionEn || "",
          geometry: JSON.stringify(f.geometry, null, 2),
          isVisible: f.isVisible,
        });
        setLoading(false);
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      nameId: form.nameId,
      nameEn: form.nameEn,
      type: form.type,
      icon: form.icon || null,
      descriptionId: form.descriptionId || null,
      descriptionEn: form.descriptionEn || null,
      geometry: JSON.parse(form.geometry),
      isVisible: form.isVisible,
    };

    try {
      if (id) {
        await api.put(`/map/${id}`, payload);
        toast.success("Lokasi diperbarui");
      } else {
        await api.post("/map", payload);
        toast.success("Lokasi ditambahkan");
      }
      router.push("/admin/peta");
    } catch {
      toast.error("Gagal menyimpan lokasi");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{id ? "Edit Lokasi" : "Tambah Lokasi"}</h1>
        <Button variant="secondary" onClick={() => router.push("/admin/peta")}>Kembali</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nama (ID)" value={form.nameId} onChange={(e) => setForm({ ...form, nameId: e.target.value })} required />
          <Input label="Nama (EN)" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select label="Tipe" value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={typeOptions} />
          <Select label="Ikon" value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} options={iconOptions} />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Deskripsi (ID)</label>
          <RichTextEditor value={form.descriptionId} onChange={(val) => setForm({ ...form, descriptionId: val })} folder="map" />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Deskripsi (EN)</label>
          <RichTextEditor value={form.descriptionEn} onChange={(val) => setForm({ ...form, descriptionEn: val })} folder="map" />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">GeoJSON Geometry</label>
          <textarea
            className="w-full h-32 p-3 border border-neutral-300 rounded-lg font-mono text-sm"
            value={form.geometry}
            onChange={(e) => setForm({ ...form, geometry: e.target.value })}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <Toggle checked={form.isVisible} onChange={() => setForm({ ...form, isVisible: !form.isVisible })} />
          <span className="text-sm">Tampilkan di peta publik</span>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" isLoading={loading}>{id ? "Simpan Perubahan" : "Simpan"}</Button>
        </div>
      </form>
    </div>
  );
}
