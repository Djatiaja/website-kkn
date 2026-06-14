"use client";

import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

export function AdminContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();
  return (
    <div
      className={cn(
        "transition-all duration-300 p-6",
        isOpen ? "ml-64" : "ml-16"
      )}
    >
      {children}
    </div>
  );
}
