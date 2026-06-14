import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center text-sm", className)}>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center">
          {idx > 0 && (
            <span className="mx-2 text-neutral-400">/</span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-neutral-500 hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-900 font-medium">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export { Breadcrumb };
export type { BreadcrumbProps, BreadcrumbItem };
