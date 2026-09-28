import { Search, X } from "lucide-react"
import { useEffect, useRef } from "react"
import clsx from "clsx"

interface SectionsSearchProps {
  setSearchQuery?: (query: string) => void
  searchQuery?: string
  onSearch?: () => void
  onSearchClear?: () => void
  placeholder?: string
  className?: string
}

const DEBOUNCE_MS = 350

export function SearchField({
  setSearchQuery,
  searchQuery,
  onSearch,
  onSearchClear,
  placeholder,
  className,
}: SectionsSearchProps) {
  const mounted = useRef(false)

  const clearSearch = () => {
    setSearchQuery?.("")
    onSearchClear?.()
  }

  // Debounced auto-search as the user types. Skips the very first render so
  // mounting with an empty query doesn't fire a redundant search.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (!onSearch) return
    const timeout = setTimeout(() => onSearch(), DEBOUNCE_MS)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  return (
    <div className={clsx("relative w-full max-w-md", className)}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
      <input
        type="search"
        role="searchbox"
        placeholder={placeholder ?? "Search"}
        value={searchQuery ?? ""}
        onChange={(e) => setSearchQuery?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch?.()
          if (e.key === "Escape" && searchQuery) clearSearch()
        }}
        className="w-full h-10 pl-10 pr-10 text-sm rounded-md border border-border bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring transition-colors duration-(--dur-fast)"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 h-6 w-6 inline-flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-(--dur-fast)"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
