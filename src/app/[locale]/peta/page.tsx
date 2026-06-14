import { getLocale } from "next-intl/server";
import { MapPageClient } from "@/components/map/MapPageClient";

export default async function PetaPage() {
  const locale = await getLocale() as "id" | "en";

  return <MapPageClient locale={locale} />;
}
