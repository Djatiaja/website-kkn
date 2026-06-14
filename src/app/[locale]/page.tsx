import { getTranslations } from "next-intl/server";
import { HeroVideo } from "@/components/home/HeroVideo";
import { VillageHighlights } from "@/components/home/VillageHighlights";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { LatestNews } from "@/components/home/LatestNews";
import { MiniMap } from "@/components/home/MiniMap";
import { prisma } from "@/lib/prisma";

async function getHomeData() {
  const [profile, products, news] = await Promise.all([
    prisma.villageProfile.findFirst(),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.news.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  return { profile, products, news };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const tNews = await getTranslations("news");

  const { profile, products, news } = await getHomeData();

  const stats = [
    {
      value: profile?.population || 5247,
      label: t("highlights.population"),
      icon: "👥",
    },
    {
      value: profile?.area ? Math.round(profile.area) : 1200,
      label: t("highlights.area"),
      icon: "🌾",
    },
    {
      value: 45,
      label: t("highlights.products"),
      icon: "🛍️",
    },
    {
      value: 12,
      label: t("highlights.attractions"),
      icon: "🏔️",
    },
  ];

  const serializedProducts = products.map((p) => ({
    ...p,
    price: p.price ? Number(p.price) : null,
    gallery: (p.gallery as string[]) || [],
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  const serializedNews = news.map((n) => ({
    ...n,
    publishedAt: n.publishedAt?.toISOString() || null,
    createdAt: n.createdAt.toISOString(),
    updatedAt: n.updatedAt.toISOString(),
  }));

  return (
    <>
      <HeroVideo
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        ctaExplore={t("hero.cta_explore")}
        ctaProducts={t("hero.cta_products")}
        videoUrl={profile?.heroVideoUrl || "/videos/hero-desa.mp4"}
      />

      <VillageHighlights stats={stats} />

      <FeaturedProducts
        products={serializedProducts}
        locale={locale as "id" | "en"}
        title={t("featured.title")}
        viewAllText={t("featured.view_all")}
      />

      <LatestNews
        news={serializedNews}
        locale={locale as "id" | "en"}
        title={t("news.title")}
        viewAllText={t("news.view_all")}
        readMoreText={tNews("read_more")}
      />

      <MiniMap
        title={t("map.title")}
        viewFullText={t("map.view_full")}
      />
    </>
  );
}
