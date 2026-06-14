import { getLocale } from "next-intl/server";
import { NewsDetailClient } from "@/components/news/NewsDetailClient";

export default async function BeritaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = await getLocale() as "id" | "en";
  return <NewsDetailClient id={id} locale={locale} />;
}
