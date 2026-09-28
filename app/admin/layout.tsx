"use client"

import StoreProvider from "@/app/StoreProvider"
import { useAuth } from "@/lib/hooks/auth/useAuth";
import type React from "react"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "@/components/shared/Skeleton";

/** Shaped like the admin shell (sidebar rail + top bar + content) so the
 *  brief auth check doesn't flash an unrelated spinner. */
function AdminShellSkeleton() {
  return (
    <div className="flex">
      <div className="h-screen w-64 max-md:w-25 border-r border-border p-4 space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0" rounded="lg" />
          <Skeleton height="1rem" width="7rem" className="max-md:hidden" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} height="2.25rem" className="w-full" rounded="md" />
          ))}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-end gap-2 py-4 px-10 border-b border-border">
          <Skeleton className="h-9 w-9" rounded="md" />
          <Skeleton className="h-9 w-9" rounded="full" />
        </div>
        <div className="p-10 space-y-4">
          <Skeleton height="1.5rem" width="12rem" />
          <Skeleton height="8rem" className="w-full" rounded="lg" />
        </div>
      </div>
    </div>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <AdminShellSkeleton />
  }

  return <StoreProvider>{children}</StoreProvider>
}
