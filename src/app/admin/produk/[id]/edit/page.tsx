"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { ProductForm } from "@/components/product/ProductForm";
import type { Product } from "@/types";

export default function AdminEditProdukPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Product>(`/products/${id}`).then((data) => {
      setProduct(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-neutral-100 rounded w-48" />
        <div className="h-64 bg-neutral-100 rounded-2xl" />
      </div>
    );
  }

  if (!product) {
    return <p className="text-neutral-500">Produk tidak ditemukan.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-6">
        Edit Produk
      </h1>
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <ProductForm product={product} isEditing />
      </div>
    </div>
  );
}
