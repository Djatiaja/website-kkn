import { cn } from "@/lib/utils";

interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
  className?: string;
}

function Skeleton({
  variant = "rectangular",
  width,
  height,
  className,
}: SkeletonProps) {
  const variants = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  return (
    <div
      className={cn(
        "bg-neutral-200 animate-pulse",
        variants[variant],
        className
      )}
      style={{ width, height }}
    />
  );
}

export { Skeleton };
export type { SkeletonProps };
