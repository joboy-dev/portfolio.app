"use client"

import StoreProvider from "@/app/StoreProvider"
import { useAuth } from "@/lib/hooks/auth/useAuth";
import type React from "react"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "../loading";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log(isAuthenticated)
    if (!loading && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <Loading />
  }

  return <StoreProvider>{children}</StoreProvider>
}
