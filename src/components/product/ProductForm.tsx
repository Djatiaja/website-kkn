"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import type { Product } from "@/types";

interface ProductFormData {
  nameId: string;
  nameEn: string;
  descriptionId: string;
  descriptionEn: string;
  category: string;
  price: number | null;
  unit: string;
  contact: string;
  isActive: boolean;
}

interface ProductFormProps {
  product?: Product;
  isEditing?: boolean;
}

export function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      nameId: product?.nameId || "",
      nameEn: product?.nameEn || "",
      descriptionId: product?.descriptionId || "",
      descriptionEn: product?.descriptionEn || "",
      category: product?.category || "UMKM",
      price: product?.price || null,
      unit: product?.unit || "",
      contact: product?.contact || "",
      isActive: product?.isActive ?? true,
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...data,
        price: data.price ? Number(data.price) : null,
        unit: data.unit || null,
        contact: data.contact || null,
      };

      if (isEditing && product) {
        await api.put(`/products/${product.id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      router.push("/admin/produk");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan produk");
    }
    setSubmitting(false);
  };

  const categories = [
    { value: "UMKM", label: "UMKM" },
    { value: "WISATA", label: "Wisata" },
    { value: "PERTANIAN", label: "Pertanian" },
    { value: "KERAJINAN", label: "Kerajinan" },
    { value: "KULINER", label: "Kuliner" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      {error && (
        <div className="p-4 bg-error/10 text-error text-sm rounded-xl border border-error/20">
          {error}
        </div>
      )}

      {/* Name ID/EN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Nama Produk (ID) <span className="text-error">*</span>
          </label>
          <input
            {...register("nameId", { required: "Wajib diisi" })}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            placeholder="Nama dalam Bahasa Indonesia"
          />
          {errors.nameId && <p className="text-xs text-error mt-1">{errors.nameId.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Product Name (EN) <span className="text-error">*</span>
          </label>
          <input
            {...register("nameEn", { required: "Required" })}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            placeholder="Name in English"
          />
          {errors.nameEn && <p className="text-xs text-error mt-1">{errors.nameEn.message}</p>}
        </div>
      </div>

      {/* Description ID/EN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Deskripsi (ID) <span className="text-error">*</span>
          </label>
          <textarea
            {...register("descriptionId", { required: "Wajib diisi", minLength: { value: 10, message: "Min 10 karakter" } })}
            rows={4}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
            placeholder="Deskripsi produk..."
          />
          {errors.descriptionId && <p className="text-xs text-error mt-1">{errors.descriptionId.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Description (EN) <span className="text-error">*</span>
          </label>
          <textarea
            {...register("descriptionEn", { required: "Required", minLength: { value: 10, message: "Min 10 characters" } })}
            rows={4}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
            placeholder="Product description..."
          />
          {errors.descriptionEn && <p className="text-xs text-error mt-1">{errors.descriptionEn.message}</p>}
        </div>
      </div>

      {/* Category, Price, Unit */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Kategori
          </label>
          <select
            {...register("category")}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Harga (Rp)
          </label>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Satuan
          </label>
          <input
            {...register("unit")}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            placeholder="pcs, kg, box..."
          />
        </div>
      </div>

      {/* Contact & Active */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Kontak (WhatsApp)
          </label>
          <input
            {...register("contact")}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            placeholder="08xxxxxxxxxx"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("isActive")}
              className="w-5 h-5 rounded border-neutral-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-neutral-700">Produk Aktif</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {submitting ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Produk"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/produk")}
          className="px-6 py-2.5 border border-neutral-200 text-neutral-700 font-medium text-sm rounded-xl hover:bg-neutral-50 transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
