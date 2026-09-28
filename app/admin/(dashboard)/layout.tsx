"use client"

import Sidebar from '@/components/shared/Sidebar'
import AdminTopBar from '@/components/shared/admin/AdminTopBar'
import { useAppDispatch } from '@/lib/hooks/redux'
import { getProfile } from '@/lib/redux/slices/profile/profile'
import type React from 'react'
import { useEffect, useState } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    dispatch(getProfile())
  }, [dispatch])

  return (
    <div className='flex min-h-screen'>
      <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />
      <div className='flex-1 min-w-0 flex flex-col'>
        <AdminTopBar onMenuClick={() => setMobileNavOpen(true)} />
        <div className="px-10 py-6 max-md:px-7 max-sm:px-4 w-full">
          {children}
        </div>
      </div>
    </div>
  )
}
