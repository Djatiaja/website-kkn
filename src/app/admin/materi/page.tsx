"use client";

import { useState } from "react";
import { MaterialTable } from "@/components/material/MaterialTable";
import { useMaterials } from "@/hooks/useMaterials";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Plus, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import type { MaterialFilters } from "@/lib/validations/material";
import { useDebounce } from "use-debounce";

export default function AdminMaterialPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [filters, setFilters] = useState<MaterialFilters>({
    page: 1,
    sortBy: "createdAt",
    sortOrder: "desc",
    pageSize: 10,
  });

  const { data, isLoading } = useMaterials({
    ...filters,
    search: debouncedSearch,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kelola Materi</h1>
          <p className="text-muted-foreground">Kelola materi digital untuk website desa.</p>
        </div>
        <Link href="/admin/materi/tambah">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Materi
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari judul..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={filters.category || ""}
            onChange={(val) => setFilters(f => ({ ...f, category: val as any || undefined, page: 1 }))}
            options={[
              { value: "", label: "Semua Kategori" },
              { value: "PENDIDIKAN", label: "Pendidikan" },
              { value: "KESEHATAN", label: "Kesehatan" },
              { value: "PERTANIAN", label: "Pertanian" },
              { value: "TEKNOLOGI", label: "Teknologi" },
              { value: "UMUM", label: "Umum" }
            ]}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <MaterialTable materials={data?.data || []} />
      )}
    </div>
  );
}
