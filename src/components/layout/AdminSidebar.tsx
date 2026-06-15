"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, FileText, ShoppingBag, DollarSign, Map as MapIcon, 
  Newspaper, Image as ImageIcon, Users, Home, ExternalLink, LogOut 
} from "lucide-react";

interface AdminSidebarProps {
  userRole: "ADMIN" | "EDITOR";
}

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Profil Desa", icon: FileText, href: "/admin/profil" },
  { label: "Produk", icon: ShoppingBag, href: "/admin/produk" },
  { label: "Keuangan", icon: DollarSign, href: "/admin/keuangan" },
  { label: "Peta", icon: MapIcon, href: "/admin/peta" },
  { label: "Berita", icon: Newspaper, href: "/admin/berita" },
  { label: "Galeri", icon: ImageIcon, href: "/admin/galeri" },
];

const adminOnlyItems = [
  { label: "Pengguna", icon: Users, href: "/admin/users" },
];

export function AdminSidebar({ userRole }: AdminSidebarProps) {
  const { isOpen, toggle } = useSidebar();
  const pathname = usePathname();

  const allItems = [
    ...menuItems,
    ...(userRole === "ADMIN" ? adminOnlyItems : []),
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-neutral-200 z-30 transition-all duration-300 flex flex-col",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
        {isOpen && (
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-neutral-700" />
            <div>
              <p className="font-heading font-bold text-sm text-neutral-900">
                Admin
              </p>
              <p className="text-[10px] text-neutral-500">Panel</p>
            </div>
          </div>
        )}
        <button
          onClick={toggle}
          className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("transition-transform", !isOpen && "rotate-180")}
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {allItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary border-l-3 border-primary"
                  : "text-neutral-700 hover:bg-neutral-100",
                !isOpen && "justify-center px-2"
              )}
              title={!isOpen ? item.label : undefined}
            >
              <span className="flex-shrink-0">
                <item.icon className="w-5 h-5" />
              </span>
              {isOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-2 border-t border-neutral-100 space-y-0.5">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-500 hover:bg-neutral-100 transition-colors",
            !isOpen && "justify-center px-2"
          )}
          title={!isOpen ? "Ke Website" : undefined}
        >
          <ExternalLink className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span>Ke Website</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-500 hover:bg-error/10 hover:text-error transition-colors w-full",
            !isOpen && "justify-center px-2"
          )}
          title={!isOpen ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
