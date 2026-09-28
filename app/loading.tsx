import Skeleton, { SkeletonHero } from "@/components/shared/Skeleton"

/**
 * Next.js's implicit route-level Suspense fallback (shown briefly during
 * hard navigation, before any page-specific skeleton takes over). Shaped
 * like a generic hero + content page rather than a spinner, so it doesn't
 * clash with the content-shaped skeletons every page shows once mounted.
 */
export default function Loading() {
  return (
    <div className="min-h-dvh bg-background">
      <div className="nav-padding flex items-center justify-between">
        <Skeleton className="h-10 w-32" rounded="md" />
        <Skeleton className="h-9 w-9" rounded="md" />
      </div>
      <section className="page-padding min-h-[60dvh] flex items-center bg-secondary/50">
        <SkeletonHero className="w-full" />
      </section>
    </div>
  )
}
