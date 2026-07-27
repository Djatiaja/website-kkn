import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import { VILLAGE_CONFIG } from "@/lib/constants";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

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
      <body
        className={`${plusJakarta.variable} ${inter.variable} font-body antialiased`}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
