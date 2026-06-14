"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button, Input, Select, Modal, Table, Toggle } from "@/components/ui";
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

interface FormData {
  nameId: string;
  nameEn: string;
  type: string;
  icon: string;
  descriptionId: string;
  descriptionEn: string;
  geometry: string;
  isVisible: boolean;
}

const emptyForm: FormData = {
  nameId: "",
  nameEn: "",
  type: "POI",
  icon: "",
  descriptionId: "",
  descriptionEn: "",
  geometry: '{"type":"Point","coordinates":[106.838,-6.730]}',
  isVisible: true,
};

export default function AdminPetaPage() {
  const [features, setFeatures] = useState<MapFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchFeatures = async () => {
    setLoading(true);
    const data = await api.get<MapFeature[]>("/map");
    setFeatures(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (f: MapFeature) => {
    setEditId(f.id);
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
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

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

    if (editId) {
      await api.put(`/map/${editId}`, payload);
    } else {
      await api.post("/map", payload);
    }

    setSaving(false);
    setModalOpen(false);
    fetchFeatures();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus lokasi ini?")) return;
    await api.delete(`/map/${id}`);
    fetchFeatures();
  };

  const toggleVisibility = async (f: MapFeature) => {
    await api.put(`/map/${f.id}`, { isVisible: !f.isVisible });
    fetchFeatures();
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
        <h1 className="text-2xl font-heading font-bold">Kelola Peta Desa</h1>
        <Button onClick={openCreate}>+ Tambah Lokasi</Button>
      </div>

      <Table columns={columns as never} data={features as never} isLoading={loading} emptyMessage="Belum ada data lokasi" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Lokasi" : "Tambah Lokasi"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama (ID)"
            value={form.nameId}
            onChange={(e) => setForm({ ...form, nameId: e.target.value })}
            required
          />
          <Input
            label="Nama (EN)"
            value={form.nameEn}
            onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
            required
          />
          <Select
            label="Tipe"
            value={form.type}
            onChange={(v) => setForm({ ...form, type: v })}
            options={typeOptions}
          />
          <Select
            label="Ikon"
            value={form.icon}
            onChange={(v) => setForm({ ...form, icon: v })}
            options={iconOptions}
          />
          <Input
            label="Deskripsi (ID)"
            value={form.descriptionId}
            onChange={(e) => setForm({ ...form, descriptionId: e.target.value })}
          />
          <Input
            label="Deskripsi (EN)"
            value={form.descriptionEn}
            onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
          />
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
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" isLoading={saving}>
              {editId ? "Simpan" : "Tambah"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
