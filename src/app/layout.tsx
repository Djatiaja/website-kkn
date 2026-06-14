import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
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
    default: "Desa Sukamakmur — Mandiri, Sejahtera, dan Berbudaya",
    template: "%s | Desa Sukamakmur",
  },
  description:
    "Website resmi Desa Sukamakmur, Kecamatan Sukamakmur, Kabupaten Bogor, Jawa Barat. Informasi profil desa, produk unggulan, transparansi keuangan, dan berita terbaru.",
  keywords: [
    "Desa Sukamakmur",
    "desa",
    "Bogor",
    "website desa",
    "profil desa",
    "produk desa",
  ],
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
