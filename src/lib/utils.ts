import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number as Indonesian Rupiah
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number in compact form (Jt = Juta/Million, M = Miliar/Billion)
 */
export function formatCompact(amount: number): string {
  if (amount >= 1_000_000_000)
    return `Rp ${(amount / 1_000_000_000).toFixed(1)} M`;
  if (amount >= 1_000_000)
    return `Rp ${(amount / 1_000_000).toFixed(0)} Jt`;
  return formatRupiah(amount);
}

/**
 * Get localized field value from a bilingual object
 */
export function localized<T extends Record<string, unknown>>(
  item: T,
  field: string,
  locale: "id" | "en"
): string {
  const key = `${field}${locale === "id" ? "Id" : "En"}`;
  return (item[key] as string) || (item[`${field}Id`] as string) || "";
}
