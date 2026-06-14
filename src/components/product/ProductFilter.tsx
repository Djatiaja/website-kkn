"use client";

import type { ProductCategory } from "@/types";

interface ProductFilterProps {
  categories: { value: string; label: string }[];
  activeCategory: string;
  searchValue: string;
  onCategoryChange: (cat: string) => void;
  onSearchChange: (val: string) => void;
  searchPlaceholder: string;
}

export function ProductFilter({
  categories,
  activeCategory,
  searchValue,
  onCategoryChange,
  onSearchChange,
  searchPlaceholder,
}: ProductFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
      {/* Search */}
      <div className="relative w-full md:w-80">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
        />
      </div>

      {/* Category buttons */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`px-4 py-2 text-xs font-medium rounded-full transition-all duration-200 ${
              activeCategory === cat.value
                ? "bg-primary text-white shadow-sm"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
