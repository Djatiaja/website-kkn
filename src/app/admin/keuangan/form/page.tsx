"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, RichTextEditor } from "@/components/ui";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { FinanceRecord } from "@/types";

export default function AdminKeuanganFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    type: "INCOME" as "INCOME" | "EXPENSE",
    categoryId: "",
    categoryEn: "",
    subcategoryId: "",
    subcategoryEn: "",
    amount: 0,
    budget: 0,
    sourceId: "",
    sourceEn: "",
    descriptionId: "",
    descriptionEn: "",
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get<FinanceRecord>(`/finance/${id}`).then((record) => {
        setForm({
          year: record.year,
          type: record.type,
          categoryId: record.categoryId,
          categoryEn: record.categoryEn,
          subcategoryId: record.subcategoryId || "",
          subcategoryEn: record.subcategoryEn || "",
          amount: record.amount,
          budget: record.budget || 0,
          sourceId: record.sourceId || "",
          sourceEn: record.sourceEn || "",
          descriptionId: record.descriptionId || "",
          descriptionEn: record.descriptionEn || "",
        });
        setLoading(false);
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await api.put(`/finance/${id}`, form);
        toast.success("Record keuangan diperbarui");
      } else {
        await api.post("/finance", form);
        toast.success("Record keuangan ditambahkan");
      }
      router.push("/admin/keuangan");
    } catch {
      toast.error("Gagal menyimpan record keuangan");
    }
    setLoading(false);
  };

  const inputClass = "mt-1 w-full px-3 py-2 border border-neutral-200 rounded-xl text-sm";

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{id ? "Edit Record Keuangan" : "Tambah Record Keuangan"}</h1>
        <Button variant="secondary" onClick={() => router.push("/admin/keuangan")}>Kembali</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-neutral-700">Tahun</label>
            <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} className={inputClass} required />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">Tipe</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "INCOME" | "EXPENSE" })} className={inputClass}>
              <option value="INCOME">Pendapatan</option>
              <option value="EXPENSE">Belanja</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-neutral-700">Kategori (ID)</label>
            <input type="text" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={inputClass} required />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">Kategori (EN)</label>
            <input type="text" value={form.categoryEn} onChange={(e) => setForm({ ...form, categoryEn: e.target.value })} className={inputClass} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-neutral-700">Sub-kategori (ID)</label>
            <input type="text" value={form.subcategoryId} onChange={(e) => setForm({ ...form, subcategoryId: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">Sub-kategori (EN)</label>
            <input type="text" value={form.subcategoryEn} onChange={(e) => setForm({ ...form, subcategoryEn: e.target.value })} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-neutral-700">Anggaran (Rp)</label>
            <input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">Realisasi (Rp)</label>
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className={inputClass} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-neutral-700">Sumber (ID)</label>
            <input type="text" value={form.sourceId} onChange={(e) => setForm({ ...form, sourceId: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">Sumber (EN)</label>
            <input type="text" value={form.sourceEn} onChange={(e) => setForm({ ...form, sourceEn: e.target.value })} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Deskripsi (ID)</label>
          <RichTextEditor value={form.descriptionId} onChange={(val) => setForm({ ...form, descriptionId: val })} folder="finance" />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Deskripsi (EN)</label>
          <RichTextEditor value={form.descriptionEn} onChange={(val) => setForm({ ...form, descriptionEn: val })} folder="finance" />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" isLoading={loading}>{id ? "Simpan Perubahan" : "Simpan"}</Button>
        </div>
      </form>
    </div>
  );
}
