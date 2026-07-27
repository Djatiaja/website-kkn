import { formatBytes } from "@/lib/utils";

interface FileSizeBadgeProps {
  size: number;
}

export function FileSizeBadge({ size }: FileSizeBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
      {formatBytes(size)}
    </span>
  );
}
