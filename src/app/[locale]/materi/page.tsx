import { getLocale } from "next-intl/server";
import { MaterialPageClient } from "./page.client";

export default async function MateriPage() {
  const locale = await getLocale() as "id" | "en";
  return <MaterialPageClient locale={locale} />;
}
