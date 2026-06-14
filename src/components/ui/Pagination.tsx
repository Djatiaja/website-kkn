"use client";

import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingsCount?: number;
  className?: string;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingsCount = 1,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const getPages = () => {
    const totalNumbers = siblingsCount * 2 + 3;
    if (totalPages <= totalNumbers + 2) {
      return range(1, totalPages);
    }

    const leftSibling = Math.max(currentPage - siblingsCount, 1);
    const rightSibling = Math.min(currentPage + siblingsCount, totalPages);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftRange = range(1, 3 + 2 * siblingsCount);
      return [...leftRange, "...", totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightRange = range(totalPages - (2 + 2 * siblingsCount), totalPages);
      return [1, "...", ...rightRange];
    }

    const middleRange = range(leftSibling, rightSibling);
    return [1, "...", ...middleRange, "...", totalPages];
  };

  const pages = getPages();

  return (
    <nav className={cn("flex items-center gap-1", className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-sm text-neutral-500 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        ←
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`dots-${idx}`} className="px-2 text-neutral-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={cn(
              "min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all duration-200",
              currentPage === page
                ? "bg-primary text-white shadow-sm"
                : "text-neutral-700 hover:bg-neutral-100"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-sm text-neutral-500 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        →
      </button>
    </nav>
  );
}

export { Pagination };
export type { PaginationProps };
