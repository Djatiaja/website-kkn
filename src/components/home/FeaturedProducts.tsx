import Link from "next/link";
import type { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
  locale: "id" | "en";
  title: string;
  viewAllText: string;
}

export function FeaturedProducts({
  products,
  locale,
  title,
  viewAllText,
}: FeaturedProductsProps) {
  const categoryColors: Record<string, string> = {
    UMKM: "bg-primary/10 text-primary",
    WISATA: "bg-info/10 text-info",
    PERTANIAN: "bg-success/10 text-success",
    KERAJINAN: "bg-accent/10 text-secondary",
    KULINER: "bg-warning/10 text-secondary",
  };

  const categoryIcons: Record<string, string> = {
    UMKM: "🏪",
    WISATA: "🏔️",
    PERTANIAN: "🌾",
    KERAJINAN: "🎨",
    KULINER: "🍜",
  };

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-2">
            {title}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const name = locale === "id" ? product.nameId : product.nameEn;
            const colorClass = categoryColors[product.category] || "bg-neutral-100 text-neutral-700";

            return (
              <Link
                key={product.id}
                href={`/produk/${product.id}`}
                className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                {/* Image / Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      {categoryIcons[product.category] || "📦"}
                    </div>
                  )}
                  {/* Badge */}
                  <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full ${colorClass}`}>
                    {product.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-heading font-semibold text-sm text-neutral-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {name}
                  </h3>
                  {product.price && (
                    <p className="text-primary font-bold text-sm">
                      Rp {new Intl.NumberFormat("id-ID").format(product.price)}
                      {product.unit && (
                        <span className="text-neutral-400 font-normal text-xs"> / {product.unit}</span>
                      )}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/produk"
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all duration-300"
          >
            {viewAllText} →
          </Link>
        </div>
      </div>
    </section>
  );
}
