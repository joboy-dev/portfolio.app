import type { Metadata } from 'next'
import StoreProvider from '@/app/StoreProvider'
import Footer from '@/components/shared/Footer'
import PublicNavbar from '@/components/shared/navbar/PublicNavbar'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <PublicNavbar />
      {children}
      <Footer />
    </StoreProvider>
  )
}
