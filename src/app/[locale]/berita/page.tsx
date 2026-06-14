import { getLocale } from "next-intl/server";
import { NewsPageClient } from "@/components/news/NewsPageClient";

export default async function BeritaPage() {
  const locale = await getLocale() as "id" | "en";
  return <NewsPageClient locale={locale} />;
}
