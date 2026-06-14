"use client";

import { cn } from "@/lib/utils";

interface Tab {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeKey?: string;
  onChange?: (key: string) => void;
  variant?: "underline" | "pill";
  className?: string;
}

function Tabs({
  tabs,
  activeKey,
  onChange,
  variant = "underline",
  className,
}: TabsProps) {
  const active = activeKey || tabs[0]?.key;

  return (
    <div className={className}>
      <div
        className={cn(
          "flex gap-1",
          variant === "underline" && "border-b border-neutral-200"
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange?.(tab.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all duration-200",
              variant === "underline" && [
                "border-b-2 -mb-px",
                active === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300",
              ],
              variant === "pill" && [
                "rounded-lg",
                active === tab.key
                  ? "bg-primary text-white shadow-sm"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700",
              ]
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find((t) => t.key === active)?.content}
      </div>
    </div>
  );
}

export { Tabs };
export type { TabsProps, Tab };
