import { getTranslations } from "next-intl/server";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ScrollReveal } from "@/components/home/ScrollReveal";

export default async function ProdukPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("product");
  const tCommon = await getTranslations("common");

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-white border-b border-neutral-100 pt-28 pb-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-2">
            🛍️ {t("title")}
          </h1>
          <p className="text-neutral-500 text-sm md:text-base max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <ProductGrid
            locale={locale as "id" | "en"}
            labels={{
              search: t("search"),
              filterAll: t("filter.all"),
              filterUmkm: t("filter.umkm"),
              filterWisata: t("filter.wisata"),
              filterPertanian: t("filter.pertanian"),
              filterKerajinan: t("filter.kerajinan"),
              filterKuliner: t("filter.kuliner"),
              empty: t("empty"),
              previous: tCommon("previous"),
              next: tCommon("next"),
            }}
          />
        </div>
      </section>
    </div>
  );
}
