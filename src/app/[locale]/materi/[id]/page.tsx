import { getLocale } from "next-intl/server";
import { MaterialDetailClient } from "./page.client";

export default async function MateriDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = (await getLocale()) as "id" | "en";
  return <MaterialDetailClient id={id} locale={locale} />;
}
