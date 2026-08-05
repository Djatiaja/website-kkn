"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Button, Input, Select, Toggle, RichTextEditor } from "@/components/ui";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { MapFeature } from "@/types";

const MapEditor = dynamic(() => import("@/components/map/MapEditor").then(m => m.MapEditor), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-neutral-100 rounded-lg flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
    </div>
  ),
});

const typeOptions = [
  { value: "BOUNDARY", label: "Batas Wilayah (Polygon)" },
  { value: "POI", label: "Titik Lokasi (Marker)" },
  { value: "FACILITY", label: "Fasilitas Umum (Marker)" },
  { value: "ROAD", label: "Jalan (Garis)" },
];

const iconOptions = [
  { value: "", label: "Tidak ada" },
  { value: "building", label: "🏛️ Gedung" },
  { value: "school", label: "🏫 Sekolah" },
  { value: "mosque", label: "🕌 Masjid" },
  { value: "hospital", label: "🏥 Puskesmas" },
  { value: "waterfall", label: "💧 Air Terjun" },
];

function AdminPetaFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const presetType = searchParams.get("type");
  const [loading, setLoading] = useState(false);
  const [allFeatures, setAllFeatures] = useState<MapFeature[]>([]);

  const [form, setForm] = useState({
    nameId: "",
    nameEn: "",
    type: (presetType && ["BOUNDARY", "POI", "FACILITY", "ROAD"].includes(presetType) ? presetType : "POI") as string,
    icon: "",
    descriptionId: "",
    descriptionEn: "",
    geometry: null as GeoJSON.Geometry | null,
    isVisible: true,
  });

  // Fetch all features for context display
  useEffect(() => {
    let cancelled = false;
    api.get<MapFeature[]>("/map").then((data) => {
      if (!cancelled) setAllFeatures(data);
    }).catch(console.error);
    return () => { cancelled = true; };
  }, []);

  // Load existing feature for edit
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    api.get<MapFeature>(`/map/${id}`).then((f) => {
      if (cancelled) return;
      setForm({
        nameId: f.nameId,
        nameEn: f.nameEn,
        type: f.type,
        icon: f.icon || "",
        descriptionId: f.descriptionId || "",
        descriptionEn: f.descriptionEn || "",
        geometry: f.geometry as GeoJSON.Geometry,
        isVisible: f.isVisible,
      });
      setLoading(false);
    }).catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const handleGeometryChange = useCallback((geometry: GeoJSON.Geometry | null) => {
    setForm(prev => ({ ...prev, geometry }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.geometry) {
      toast.error("Silakan gambar lokasi di peta terlebih dahulu");
      return;
    }

    setLoading(true);

    const payload = {
      nameId: form.nameId,
      nameEn: form.nameEn,
      type: form.type,
      icon: form.icon || null,
      descriptionId: form.descriptionId || null,
      descriptionEn: form.descriptionEn || null,
      geometry: form.geometry,
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

  // Context features: all features except the one being edited
  const contextFeatures = allFeatures.filter(f => f.id !== id);

  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{id ? "Edit Lokasi" : form.type === "BOUNDARY" ? "Tambah Batas Wilayah" : "Tambah Lokasi"}</h1>
        <Button variant="secondary" onClick={() => router.push("/admin/peta")}>Kembali</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Map Editor */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Gambarkan di Peta</h2>
          <p className="text-sm text-neutral-500 mb-4">
            {form.type === "BOUNDARY" && "Gunakan tools polygon (揳) di kanan atas untuk menggambar batas wilayah. Klik titik-titik di peta, lalu klik titik pertama untuk menutup polygon."}
            {form.type === "POI" && "Gunakan tools marker (📍) di kanan atas, lalu klik di peta untuk menempatkan titik lokasi."}
            {form.type === "FACILITY" && "Gunakan tools marker (📍) di kanan atas, lalu klik di peta untuk menempatkan titik fasilitas."}
            {form.type === "ROAD" && "Gunakan tools garis (/) di kanan atas untuk menggambar jalur jalan. Double-click untuk mengakhiri."}
          </p>
          <div className="rounded-lg overflow-hidden border border-neutral-200">
            <MapEditor
              geometry={form.geometry}
              featureType={form.type as "BOUNDARY" | "POI" | "ROAD" | "FACILITY"}
              contextFeatures={contextFeatures}
              onGeometryChange={handleGeometryChange}
              locale="id"
            />
          </div>
          {form.geometry ? (
            <p className="text-xs text-green-600 mt-2">✓ Geometri sudah digambar</p>
          ) : (
            <p className="text-xs text-amber-600 mt-2">⚠ Belum ada geometri — gambar di peta di atas</p>
          )}
        </div>

        {/* Info Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <h2 className="text-lg font-semibold">Informasi Lokasi</h2>

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

          <div className="flex items-center gap-2">
            <Toggle checked={form.isVisible} onChange={() => setForm({ ...form, isVisible: !form.isVisible })} />
            <span className="text-sm">Tampilkan di peta publik</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" isLoading={loading} disabled={!form.geometry}>{id ? "Simpan Perubahan" : "Simpan"}</Button>
        </div>
      </form>
    </div>
  );
}

export default function AdminPetaFormPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
      </div>
    }>
      <AdminPetaFormContent />
    </Suspense>
  );
}
