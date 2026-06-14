"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  locale: "id" | "en";
  isScrolled?: boolean;
}

export function LanguageSwitcher({
  locale,
  isScrolled = true,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = locale === "id" ? "en" : "id";
    // Replace current locale prefix in path
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <button
      onClick={switchLocale}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
        isScrolled
          ? "text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
          : "text-white/90 hover:bg-white/10 border border-white/20"
      )}
      aria-label={`Switch to ${locale === "id" ? "English" : "Indonesian"}`}
    >
      <span className="text-base">{locale === "id" ? "🇮🇩" : "🇬🇧"}</span>
      <span className="hidden sm:inline">{locale === "id" ? "ID" : "EN"}</span>
    </button>
  );
}
