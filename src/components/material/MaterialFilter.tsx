"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Search } from "lucide-react";
import type { MaterialFilters } from "@/lib/validations/material";

interface MaterialFilterProps {
  filters: MaterialFilters;
  onFilterChange: (filters: Partial<MaterialFilters>) => void;
}

export function MaterialFilter({ filters, onFilterChange }: MaterialFilterProps) {
  const t = useTranslations("materials");

  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-neutral-100">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        <input
          type="text"
          placeholder={t("search")}
          value={filters.search || ""}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full pl-11 pr-4 py-3 rounded-lg bg-neutral-50 border-none text-neutral-900 placeholder:text-neutral-500 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors"
        />
      </div>
      <div className="w-full sm:w-56">
        <Select
          value={filters.category || ""}
          onChange={(val) => onFilterChange({ category: val as any || undefined })}
          options={[
            { value: "", label: t("category") + " (Semua)" },
            { value: "PENDIDIKAN", label: t("categories.PENDIDIKAN") },
            { value: "KESEHATAN", label: t("categories.KESEHATAN") },
            { value: "PERTANIAN", label: t("categories.PERTANIAN") },
            { value: "TEKNOLOGI", label: t("categories.TEKNOLOGI") },
            { value: "UMUM", label: t("categories.UMUM") }
          ]}
        />
      </div>
    </div>
  );
}
