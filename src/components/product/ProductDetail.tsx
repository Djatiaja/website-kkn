"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/types";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
  locale: "id" | "en";
  labels: {
    price: string;
    contact: string;
    whatsapp: string;
    related: string;
    back: string;
  };
}

export function ProductDetail({ product, relatedProducts, locale, labels }: ProductDetailProps) {
  const name = locale === "id" ? product.nameId : product.nameEn;
  const description = locale === "id" ? product.descriptionId : product.descriptionEn;

  const images = product.imageUrl
    ? [product.imageUrl, ...product.gallery]
    : product.gallery.length > 0
      ? product.gallery
      : [];

  const [activeImage, setActiveImage] = useState(0);

  const whatsappLink = product.contact
    ? `https://wa.me/62${product.contact.replace(/^0/, "")}?text=${encodeURIComponent(`Halo, saya tertarik dengan produk "${locale === "id" ? product.nameId : product.nameEn}". Apakah masih tersedia?`)}`
    : null;

  const categoryColors: Record<string, string> = {
    UMKM: "bg-primary/10 text-primary",
    WISATA: "bg-info/10 text-info",
    PERTANIAN: "bg-success/10 text-success",
    KERAJINAN: "bg-accent/10 text-secondary",
    KULINER: "bg-warning/10 text-secondary",
  };

  return (
    <div>
      {/* Back link */}
      <Link
        href="/produk"
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary transition-colors mb-6"
      >
        ← {labels.back}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 border border-neutral-200">
            {images.length > 0 ? (
              <img
                src={images[activeImage]}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl opacity-50">
                📦
              </div>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === idx ? "border-primary" : "border-neutral-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-3 ${categoryColors[product.category] || "bg-neutral-100"}`}>
            {product.category}
          </span>

          <h1 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900 mb-4">
            {name}
          </h1>

          {product.price && (
            <div className="mb-6">
              <p className="text-sm text-neutral-500">{labels.price}</p>
              <p className="text-2xl font-bold text-primary">
                Rp {new Intl.NumberFormat("id-ID").format(product.price)}
                {product.unit && (
                  <span className="text-base text-neutral-400 font-normal"> / {product.unit}</span>
                )}
              </p>
            </div>
          )}

          <div className="mb-6">
            <p className="text-neutral-700 leading-relaxed">{description}</p>
          </div>

          {/* Contact */}
          {product.contact && (
            <div className="border-t border-neutral-200 pt-6 space-y-3">
              <p className="text-sm text-neutral-500">
                📞 {labels.contact}: <span className="font-medium text-neutral-700">{product.contact}</span>
              </p>
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 hover:-translate-y-0.5 transition-all duration-300 text-sm"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.105 1.513 5.834L0 24l6.338-1.663A11.937 11.937 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.927 0-3.758-.504-5.356-1.39l-.384-.228-3.98 1.044 1.063-3.882-.25-.397A9.782 9.782 0 012.18 12c0-5.418 4.402-9.82 9.82-9.82 5.418 0 9.82 4.402 9.82 9.82 0 5.418-4.402 9.82-9.82 9.82z" />
                  </svg>
                  {labels.whatsapp}
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-heading font-bold text-neutral-900 mb-6">
            📦 {labels.related}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
