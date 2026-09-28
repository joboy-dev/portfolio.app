import React from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/** Windowed page list: first, last, current +/-1, ellipsis for the gaps. */
function getPageWindow(current: number, total: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];
  const window = new Set([1, total, current - 1, current, current + 1]);

  let prev: number | undefined;
  for (let page = 1; page <= total; page++) {
    if (!window.has(page) || page < 1 || page > total) continue;
    if (prev !== undefined && page - prev > 1) pages.push("ellipsis");
    pages.push(page);
    prev = page;
  }
  return pages;
}

const buttonBase =
  "h-10 min-w-10 px-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-(--dur-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-40 disabled:cursor-not-allowed";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className={clsx("flex items-center justify-center gap-1.5 mt-6", className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={clsx(buttonBase, "text-muted-foreground hover:bg-muted hover:text-foreground")}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      <span className="sm:hidden text-sm text-muted-foreground px-2">
        Page {currentPage} of {totalPages}
      </span>

      <div className="flex items-center gap-1.5 max-sm:hidden">
        {getPageWindow(currentPage, totalPages).map((page, idx) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${idx}`} className="h-10 w-6 inline-flex items-center justify-center text-muted-foreground text-sm">
              &hellip;
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={clsx(
                buttonBase,
                page === currentPage
                  ? "bg-primary-strong text-white"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={clsx(buttonBase, "text-muted-foreground hover:bg-muted hover:text-foreground")}
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
};

export default Pagination;
