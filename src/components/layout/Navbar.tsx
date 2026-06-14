"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavbarProps {
  locale: "id" | "en";
}

const navLinks = [
  { key: "home", href: "/" },
  { key: "profile", href: "/profil" },
  { key: "products", href: "/produk" },
  { key: "finance", href: "/keuangan" },
  { key: "map", href: "/peta" },
  { key: "news", href: "/berita" },
  { key: "gallery", href: "/galeri" },
];

export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isHome = pathname === `/${locale}` || pathname === "/";
  const [isScrolled, setIsScrolled] = useState(!isHome);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed z-50 transition-all duration-300",
          isScrolled
            ? "top-4 left-4 right-4 bg-white/95 backdrop-blur-md shadow-lg py-2 px-4 rounded-2xl"
            : "top-0 left-0 right-0 bg-transparent py-4 px-4"
        )}
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className={cn(
              "flex items-center gap-2 font-heading font-bold text-lg transition-colors",
              isScrolled ? "text-neutral-900" : "text-white"
            )}
          >
            <span className="text-2xl">🏘️</span>
            <span className="hidden sm:inline">Desa Sukamakmur</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const fullHref = `/${locale}${link.href === "/" ? "" : link.href}`;
              const isActive =
                pathname === fullHref ||
                (link.href !== "/" && pathname?.startsWith(fullHref));

              return (
                <Link
                  key={link.key}
                  href={fullHref}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? isScrolled
                        ? "text-primary bg-primary/10"
                        : "text-white bg-white/20"
                      : isScrolled
                        ? "text-neutral-700 hover:text-primary hover:bg-neutral-100"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  {t(link.key)}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher locale={locale} isScrolled={isScrolled} />

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className={cn(
                "lg:hidden p-2 rounded-lg transition-colors",
                isScrolled
                  ? "text-neutral-700 hover:bg-neutral-100"
                  : "text-white hover:bg-white/10"
              )}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isMobileOpen ? (
                  <>
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </>
                ) : (
                  <>
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl lg:hidden animate-slide-in-right">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="font-heading font-bold text-lg text-neutral-900">
                  🏘️ Menu
                </span>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100"
                >
                  ✕
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const fullHref = `/${locale}${link.href === "/" ? "" : link.href}`;
                  const isActive =
                    pathname === fullHref ||
                    (link.href !== "/" && pathname?.startsWith(fullHref));

                  return (
                    <Link
                      key={link.key}
                      href={fullHref}
                      className={cn(
                        "px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-neutral-700 hover:bg-neutral-100"
                      )}
                    >
                      {t(link.key)}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
