"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  // Use lazy initializer to read from localStorage immediately, avoiding double-render
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("admin-sidebar-open");
      return stored !== null ? stored === "true" : true;
    }
    return true;
  });

  const toggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      localStorage.setItem("admin-sidebar-open", String(next));
      return next;
    });
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
