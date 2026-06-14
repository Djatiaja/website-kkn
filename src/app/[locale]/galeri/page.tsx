import { getLocale } from "next-intl/server";
import { GalleryPageClient } from "@/components/gallery/GalleryPageClient";

export default async function GaleriPage() {
  const locale = await getLocale() as "id" | "en";
  return <GalleryPageClient locale={locale} />;
}
