import { FinancePageClient } from "@/components/finance/FinancePageClient";

export default async function FinancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <FinancePageClient locale={locale as "id" | "en"} />;
}
