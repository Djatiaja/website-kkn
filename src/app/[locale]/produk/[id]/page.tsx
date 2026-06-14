import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return null;
  return {
    ...product,
    price: product.price ? Number(product.price) : null,
    gallery: (product.gallery as string[]) || [],
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

async function getRelatedProducts(category: string, excludeId: string) {
  const products = await prisma.product.findMany({
    where: { category: category as never, isActive: true, id: { not: excludeId } },
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  return products.map((p) => ({
    ...p,
    price: p.price ? Number(p.price) : null,
    gallery: (p.gallery as string[]) || [],
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
}

export default async function ProdukDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("product");

  const product = await getProduct(id);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category, product.id);

  return (
    <div className="min-h-screen bg-neutral-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <ProductDetail
          product={product}
          relatedProducts={related}
          locale={locale as "id" | "en"}
          labels={{
            price: t("price"),
            contact: t("contact"),
            whatsapp: t("whatsapp"),
            related: t("related"),
            back: t("back"),
          }}
        />
      </div>
    </div>
  );
}
