"use client";

import { ProductForm } from "@/components/product/ProductForm";

export default function AdminTambahProdukPage() {
  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-6">
        Tambah Produk Baru
      </h1>
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <ProductForm />
      </div>
    </div>
  );
}
