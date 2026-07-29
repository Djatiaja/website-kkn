import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Home, MapPin, Phone, Mail } from "lucide-react";
import { VILLAGE_CONFIG } from "@/lib/constants";

interface FooterProfileData {
  name: string;
  address: string;
  phone?: string | null;
  email?: string | null;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  } | null;
  footerDescriptionId?: string | null;
  footerDescriptionEn?: string | null;
  copyrightId?: string | null;
  copyrightEn?: string | null;
}

interface FooterProps {
  locale: "id" | "en";
  profile?: FooterProfileData;
}

export function Footer({ locale, profile }: FooterProps) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  // ponytail: fallback to VILLAGE_CONFIG if no profile data from DB
  const name = profile?.name || VILLAGE_CONFIG.name;
  const address = profile?.address || VILLAGE_CONFIG.address;
  const phone = profile?.phone || VILLAGE_CONFIG.phone;
  const email = profile?.email || VILLAGE_CONFIG.email;
  const social = profile?.socialMedia || VILLAGE_CONFIG.socialMedia;

  const footerDescription = locale === "id"
    ? (profile?.footerDescriptionId || t("description"))
    : (profile?.footerDescriptionEn || t("description"));

  const copyright = locale === "id"
    ? (profile?.copyrightId || t("copyright"))
    : (profile?.copyrightEn || t("copyright"));

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
    <>
    <footer className="bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Village Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-heading font-bold text-lg">{name}</h3>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              {footerDescription}
            </p>
            {/* Social Media */}
            <div className="flex gap-3 mb-4">
              {social?.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-sm hover:bg-primary transition-colors"
                  aria-label="Facebook">FB</a>
              )}
              {social?.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-sm hover:bg-primary transition-colors"
                  aria-label="Instagram">IG</a>
              )}
              {social?.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-sm hover:bg-primary transition-colors"
                  aria-label="YouTube">YT</a>
              )}
            </div>
            {/* Logos - side by side */}
            <div className="flex items-center gap-4">
              <Image
                src="/kknwindusari.png"
                alt="Windusari Asri"
                width={100}
                height={28}
                className="opacity-60 hover:opacity-90 transition-opacity"
              />
              <Image
                src="/KKN-UGM.png"
                alt="KKN UGM"
                width={100}
                height={28}
                className="opacity-60 hover:opacity-90 transition-opacity"
              />
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
                  <p className="font-medium text-neutral-300">{t("address")}</p>
                  <p>{address}</p>
                </div>
              </div>
              {phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-neutral-400" />
                  <div>
                    <span className="font-medium text-neutral-300">{t("phone")}:</span> {phone}
                  </div>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-neutral-400" />
                  <div>
                    <span className="font-medium text-neutral-300">{t("email")}:</span> {email}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </footer>
    </>
  );
}
