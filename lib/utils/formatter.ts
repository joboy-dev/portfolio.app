/**
 * Format a price with the appropriate currency symbol
 */
export function formatPrice(price: number, currency = "NGN"): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return formatter.format(price)
}

/**
 * Format a date string into a readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

/**
 * Format a date as relative time ("2h ago"), falling back to `formatDate`
 * once it's more than a week old — relative time stops being useful at
 * that point and just gets confusing ("47d ago" vs. a real date).
 */
export function formatRelativeTime(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(dateString)
}

/**
 * Format a date with time
 */
export function formatDateTime(dateString?: string): string {
  if (!dateString) return ""
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("en-US")
}

/**
 * Format a percentage
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

/**
 * Turn a raw 0-100 proficiency number into a level word for public display.
 * The exact number stays admin-only (see admin/skills).
 */
export function getSkillLevel(proficiency?: number): string {
  const value = proficiency ?? 0
  if (value >= 90) return "Expert"
  if (value >= 70) return "Advanced"
  if (value >= 40) return "Proficient"
  return "Familiar"
}

/**
 * Estimate reading time from raw (markdown) content, at 200 words/minute.
 * Strips markdown syntax roughly enough to not massively over-count.
 */
export function getReadTime(content?: string): string {
  const plainText = (content ?? '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*_`~\-\[\]()!]/g, ' ')
  const words = plainText.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
