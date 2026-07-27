import Link from "next/link";
import { useTranslations } from "next-intl";
import { Home, MapPin, Phone, Mail } from "lucide-react";
import { VILLAGE_CONFIG } from "@/lib/constants";

interface FooterProps {
  locale: "id" | "en";
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  const navLinks = [
    { label: tNav("home"), href: `/${locale}` },
    { label: tNav("profile"), href: `/${locale}/profil` },
    { label: tNav("products"), href: `/${locale}/produk` },
    { label: tNav("finance"), href: `/${locale}/keuangan` },
    { label: tNav("map"), href: `/${locale}/peta` },
    { label: tNav("news"), href: `/${locale}/berita` },
    { label: tNav("gallery"), href: `/${locale}/galeri` },
  ];

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Village Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-6 h-6 text-primary" />
              <h3 className="font-heading font-bold text-lg">
                {VILLAGE_CONFIG.name}
              </h3>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              {t("description")}
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              <a
                href={VILLAGE_CONFIG.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-sm hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                FB
              </a>
              <a
                href={VILLAGE_CONFIG.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-sm hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href={VILLAGE_CONFIG.socialMedia.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-sm hover:bg-primary transition-colors"
                aria-label="YouTube"
              >
                YT
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading font-semibold mb-4">
              {t("navigation")}
            </h4>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-neutral-400 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold mb-4">{t("contact")}</h4>
            <div className="space-y-3 text-sm text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="font-medium text-neutral-300">
                    {t("address")}
                  </p>
                  <p>
                    {VILLAGE_CONFIG.address}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-neutral-400" />
                <div>
                  <span className="font-medium text-neutral-300">
                    {t("phone")}:
                  </span>{" "}
                  {VILLAGE_CONFIG.phone}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-neutral-400" />
                <div>
                  <span className="font-medium text-neutral-300">
                    {t("email")}:
                  </span>{" "}
                  {VILLAGE_CONFIG.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-xs text-neutral-500">
            {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
