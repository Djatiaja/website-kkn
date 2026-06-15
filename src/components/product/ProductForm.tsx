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
  storeImageUrl: string;
  productionImageUrl: string;
  gallery: string;
  locationUrl: string;
  specificationsId: string;
  specificationsEn: string;
  isPotential: boolean;
  investmentRequired: number | null;
  investmentDetailsId: string;
  investmentDetailsEn: string;
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

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      nameId: product?.nameId || "",
      nameEn: product?.nameEn || "",
      descriptionId: product?.descriptionId || "",
      descriptionEn: product?.descriptionEn || "",
      category: product?.category || "UMKM",
      price: product?.price || null,
      unit: product?.unit || "",
      contact: product?.contact || "",
      storeImageUrl: product?.storeImageUrl || "",
      productionImageUrl: product?.productionImageUrl || "",
      gallery: product?.gallery ? product.gallery.join("\n") : "",
      locationUrl: product?.locationUrl || "",
      specificationsId: product?.specificationsId || "",
      specificationsEn: product?.specificationsEn || "",
      isPotential: product?.isPotential ?? false,
      investmentRequired: product?.investmentRequired || null,
      investmentDetailsId: product?.investmentDetailsId || "",
      investmentDetailsEn: product?.investmentDetailsEn || "",
      isActive: product?.isActive ?? true,
    },
  });

  const selectedCategory = watch("category");
  const isPotential = watch("isPotential");

  const onSubmit = async (data: ProductFormData) => {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...data,
        price: data.price ? Number(data.price) : null,
        unit: data.unit || null,
        contact: data.contact || null,
        storeImageUrl: data.storeImageUrl || null,
        productionImageUrl: data.productionImageUrl || null,
        gallery: data.gallery ? data.gallery.split("\n").map(s => s.trim()).filter(Boolean) : [],
        locationUrl: data.locationUrl || null,
        specificationsId: data.specificationsId || null,
        specificationsEn: data.specificationsEn || null,
        isPotential: data.category === "WISATA" ? data.isPotential : false,
        investmentRequired: data.category === "WISATA" && data.investmentRequired ? Number(data.investmentRequired) : null,
        investmentDetailsId: data.category === "WISATA" ? data.investmentDetailsId || null : null,
        investmentDetailsEn: data.category === "WISATA" ? data.investmentDetailsEn || null : null,
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
      </div>

      {/* Specifications ID/EN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Spesifikasi (ID)
          </label>
          <textarea
            {...register("specificationsId")}
            rows={4}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
            placeholder="Spesifikasi produk..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Specifications (EN)
          </label>
          <textarea
            {...register("specificationsEn")}
            rows={4}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
            placeholder="Product specifications..."
          />
        </div>
      </div>

      {/* Image URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            URL Gambar Toko
          </label>
          <input
            {...register("storeImageUrl")}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            URL Gambar Proses Produksi
          </label>
          <input
            {...register("productionImageUrl")}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Galeri (1 URL per baris)
          </label>
          <textarea
            {...register("gallery")}
            rows={4}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
            placeholder="https://...&#10;https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            URL Embed Google Maps (Opsional)
          </label>
          <textarea
            {...register("locationUrl")}
            rows={4}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
            placeholder='<iframe src="https://www.google.com/maps/embed?...'
          />
        </div>
      </div>

      {/* Active Checkbox */}
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

      {/* Investment Information (Wisata Only) */}
      {selectedCategory === "WISATA" && (
        <div className="pt-6 border-t border-neutral-200">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Peluang Investasi (Potensi Wisata)</h3>
          
          <label className="flex items-center gap-3 cursor-pointer mb-6">
            <input
              type="checkbox"
              {...register("isPotential")}
              className="w-5 h-5 rounded border-neutral-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-neutral-700">Tandai sebagai Potensi Wisata (Belum Aktif Sepenuhnya)</span>
          </label>

          {(isPotential || true) && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Kebutuhan Investasi (Rp)
                </label>
                <input
                  type="number"
                  {...register("investmentRequired", { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Detail Investasi (ID)
                  </label>
                  <textarea
                    {...register("investmentDetailsId")}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                    placeholder="Contoh: Dibutuhkan investasi untuk pembangunan akses jalan dan gazebo..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Investment Details (EN)
                  </label>
                  <textarea
                    {...register("investmentDetailsEn")}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                    placeholder="Example: Investment needed for road access and gazebos..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
