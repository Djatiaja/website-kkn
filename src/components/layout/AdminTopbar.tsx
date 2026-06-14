"use client";

import { useSidebar } from "@/contexts/SidebarContext";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { cn } from "@/lib/utils";

interface AdminTopbarProps {
  breadcrumbs: BreadcrumbItem[];
  user: { name: string; email: string; role: string };
}

export function AdminTopbar({ breadcrumbs, user }: AdminTopbarProps) {
  const { isOpen } = useSidebar();

  return (
    <header
      className={cn(
        "sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-neutral-200 transition-all duration-300",
        isOpen ? "ml-64" : "ml-16"
      )}
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbs} />

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-neutral-900">{user.name}</p>
            <p className="text-xs text-neutral-500">{user.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
