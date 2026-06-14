"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "./ProductCard";
import { ProductFilter } from "./ProductFilter";
import type { Product, PaginatedResponse } from "@/types";
import { api } from "@/lib/api";

interface ProductGridProps {
  locale: "id" | "en";
  labels: {
    search: string;
    filterAll: string;
    filterUmkm: string;
    filterWisata: string;
    filterPertanian: string;
    filterKerajinan: string;
    filterKuliner: string;
    empty: string;
    previous: string;
    next: string;
  };
}

export function ProductGrid({ locale, labels }: ProductGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = 8;

  const categories = [
    { value: "", label: labels.filterAll },
    { value: "UMKM", label: labels.filterUmkm },
    { value: "WISATA", label: labels.filterWisata },
    { value: "PERTANIAN", label: labels.filterPertanian },
    { value: "KERAJINAN", label: labels.filterKerajinan },
    { value: "KULINER", label: labels.filterKuliner },
  ];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    params.set("isActive", "true");

    const query = params.toString();
    const result = await api.get<PaginatedResponse<Product>>(`/products?${query}`);
    setProducts(result.data);
    setTotal(result.total);
    setLoading(false);
  }, [category, search, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page when filters change
    if (key !== "page") params.delete("page");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <ProductFilter
        categories={categories}
        activeCategory={category}
        searchValue={search}
        onCategoryChange={(cat) => updateParams("category", cat)}
        onSearchChange={(val) => updateParams("search", val)}
        searchPlaceholder={labels.search}
      />

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden animate-pulse">
              <div className="h-48 bg-neutral-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-neutral-100 rounded w-3/4" />
                <div className="h-4 bg-neutral-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">📦</span>
          <p className="text-neutral-500">{labels.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => updateParams("page", String(page - 1))}
            disabled={page <= 1}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
          >
            {labels.previous}
          </button>
          <span className="px-4 py-2 text-sm text-neutral-600">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => updateParams("page", String(page + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
          >
            {labels.next}
          </button>
        </div>
      )}
    </div>
  );
}
