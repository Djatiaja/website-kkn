"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Product, PaginatedResponse } from "@/types";

export default function AdminProdukPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const pageSize = 10;

  const fetchProducts = async () => {
    setLoading(true);
    const result = await api.get<PaginatedResponse<Product>>(
      `/products?page=${page}&pageSize=${pageSize}`
    );
    setProducts(result.data);
    setTotal(result.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    setDeleting(id);
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Gagal menghapus produk");
    }
    setDeleting(null);
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await api.put(`/products/${product.id}`, { isActive: !product.isActive });
      fetchProducts();
    } catch (err) {
      alert("Gagal mengubah status");
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  const categoryColors: Record<string, string> = {
    UMKM: "bg-primary/10 text-primary",
    WISATA: "bg-info/10 text-info",
    PERTANIAN: "bg-success/10 text-success",
    KERAJINAN: "bg-accent/10 text-secondary",
    KULINER: "bg-warning/10 text-secondary",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">
            Kelola Produk
          </h1>
          <p className="text-sm text-neutral-500">
            Total: {total} produk
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/produk/tambah")}
          className="px-4 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary-dark transition-colors"
        >
          + Tambah Produk
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left p-4 font-medium text-neutral-600">Produk</th>
                <th className="text-left p-4 font-medium text-neutral-600">Kategori</th>
                <th className="text-left p-4 font-medium text-neutral-600">Harga</th>
                <th className="text-left p-4 font-medium text-neutral-600">Status</th>
                <th className="text-right p-4 font-medium text-neutral-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-neutral-100 animate-pulse">
                    <td className="p-4"><div className="h-4 bg-neutral-100 rounded w-40" /></td>
                    <td className="p-4"><div className="h-4 bg-neutral-100 rounded w-20" /></td>
                    <td className="p-4"><div className="h-4 bg-neutral-100 rounded w-24" /></td>
                    <td className="p-4"><div className="h-4 bg-neutral-100 rounded w-16" /></td>
                    <td className="p-4"><div className="h-4 bg-neutral-100 rounded w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-neutral-500">
                    Belum ada produk
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="w-full h-full flex items-center justify-center text-lg">📦</span>
                          )}
                        </div>
                        <span className="font-medium text-neutral-900 line-clamp-1">
                          {product.nameId}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${categoryColors[product.category] || ""}`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-700">
                      {product.price
                        ? `Rp ${new Intl.NumberFormat("id-ID").format(product.price)}`
                        : "-"}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                          product.isActive
                            ? "bg-success/10 text-success"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {product.isActive ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/produk/${product.id}/edit`)}
                          className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id}
                          className="px-3 py-1.5 text-xs font-medium text-error bg-error/5 rounded-lg hover:bg-error/10 transition-colors disabled:opacity-50"
                        >
                          {deleting === product.id ? "..." : "Hapus"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-neutral-200">
            <p className="text-xs text-neutral-500">
              Halaman {page} dari {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-xs border border-neutral-200 rounded-lg disabled:opacity-50 hover:bg-neutral-50"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-xs border border-neutral-200 rounded-lg disabled:opacity-50 hover:bg-neutral-50"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
