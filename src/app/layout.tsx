import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/Toast";
import { VILLAGE_CONFIG } from "@/lib/constants";
import "./globals.css";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/inter";

export const metadata: Metadata = {
  title: {
    default: `${VILLAGE_CONFIG.name} — ${VILLAGE_CONFIG.tagline}`,
    template: `%s | ${VILLAGE_CONFIG.name}`,
  },
  description: VILLAGE_CONFIG.seoDescription,
  keywords: [...VILLAGE_CONFIG.seoKeywords],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="font-body antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
