import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { profileService } from "@/services/profile.service";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  // ponytail: fetch profile once for footer data
  const profile = await profileService.get().catch(() => null);

  return (
    <NextIntlClientProvider messages={messages}>
      <QueryProvider>
        <Navbar locale={locale as "id" | "en"} />
        <main className="min-h-screen">{children}</main>
        <Footer locale={locale as "id" | "en"} profile={profile as any || undefined} />
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
