import StoreProvider from "@/app/StoreProvider"
import Footer from "@/components/shared/Footer"
import type React from "react"
import PublicNavbar from "@/components/shared/navbar/PublicNavbar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <PublicNavbar />
      {children}
      <Footer />
    </StoreProvider>
  )
}
