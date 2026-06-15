"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Store, MountainSnow, Sprout, Paintbrush, UtensilsCrossed, Package } from "lucide-react";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  locale: "id" | "en";
}

const categoryColors: Record<string, string> = {
  UMKM: "bg-primary/10 text-primary",
  WISATA: "bg-info/10 text-info",
  PERTANIAN: "bg-success/10 text-success",
  KERAJINAN: "bg-accent/10 text-secondary",
  KULINER: "bg-warning/10 text-secondary",
};

const categoryIcons: Record<string, React.ReactNode> = {
  UMKM: <Store className="w-12 h-12 text-neutral-300" />,
  WISATA: <MountainSnow className="w-12 h-12 text-neutral-300" />,
  PERTANIAN: <Sprout className="w-12 h-12 text-neutral-300" />,
  KERAJINAN: <Paintbrush className="w-12 h-12 text-neutral-300" />,
  KULINER: <UtensilsCrossed className="w-12 h-12 text-neutral-300" />,
};

export function ProductCard({ product, locale }: ProductCardProps) {
  const name = locale === "id" ? product.nameId : product.nameEn;
  const colorClass = categoryColors[product.category] || "bg-neutral-100 text-neutral-700";

  return (
    <Link
      href={`/produk/${product.id}`}
      className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {categoryIcons[product.category] || <Package className="w-12 h-12 text-neutral-300" />}
          </div>
        )}
        <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full ${colorClass}`}>
          {product.category === "WISATA" ? (product.isPotential ? "Potensi Wisata" : "Wisata") : product.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading font-semibold text-sm text-neutral-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        {product.price && product.price > 0 ? (
          <p className="text-primary font-bold text-sm mt-1">
            Rp {new Intl.NumberFormat("id-ID").format(product.price)}
            {product.unit && (
              <span className="text-neutral-400 font-normal text-xs"> / {product.unit}</span>
            )}
          </p>
        ) : (
          <p className="text-neutral-500 text-xs line-clamp-2 mt-1 leading-relaxed">
            {locale === "id" ? product.descriptionId : product.descriptionEn}
          </p>
        )}
      </div>
    </Link>
  );
}
