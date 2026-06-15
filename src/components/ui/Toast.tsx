"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertTriangle, X, Info } from "lucide-react";

// ─── Types ──────────────────────────────────────────────
interface ToastOptions {
  title: string;
  description?: string;
  variant: "success" | "error" | "warning" | "info";
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextType {
  toast: (options: ToastOptions) => void;
}

// ─── Context ────────────────────────────────────────────
const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// ─── Provider ───────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).slice(2);
    const newToast = { ...options, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, options.duration || 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <ToastItem key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ─── Toast Item ─────────────────────────────────────────
function ToastItem({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: () => void;
}) {
  const icons = {
    success: <CheckCircle2 className="w-4 h-4" />,
    error: <XCircle className="w-4 h-4" />,
    warning: <AlertTriangle className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />,
  };

  const variants = {
    success: "bg-success/10 border-success/30 text-success",
    error: "bg-error/10 border-error/30 text-error",
    warning: "bg-warning/10 border-warning/30 text-warning",
    info: "bg-info/10 border-info/30 text-info",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm shadow-lg animate-slide-in-right",
        variants[item.variant]
      )}
    >
      <span className="text-lg font-bold flex-shrink-0">
        {icons[item.variant]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{item.title}</p>
        {item.description && (
          <p className="text-xs mt-0.5 opacity-80">{item.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
