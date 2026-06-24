"use client"

import Sidebar from '@/components/shared/Sidebar'
import ThemeToggle from '@/components/shared/ThemeToggle'
import Avatar from '@/components/shared/Avatar'
import { DropdownButton } from '@/components/shared/button/DropdownButton'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { logout } from '@/lib/redux/slices/auth/auth'
import { getProfile } from '@/lib/redux/slices/profile/profile'
import { Globe, LogOut } from 'lucide-react'
import type React from 'react'
import { useEffect } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { profile } = useAppSelector((state) => state.profile)

  useEffect(() => {
    dispatch(getProfile())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex-1 overflow-y-scroll h-screen'>
        <nav className='py-4 px-10'>
          <div className='flex items-center justify-between'>
            <div></div>
            <div className='flex items-center gap-2'>
              <ThemeToggle />
              <DropdownButton
                variant='ghost'
                size='sm'
                buttonIcon={
                  <span className="flex items-center gap-2">
                    <Avatar src={profile?.image_url} name={profile?.first_name} size="sm" />
                    <span className="text-sm font-medium text-foreground max-md:hidden">
                      {profile?.first_name ?? 'Account'}
                    </span>
                  </span>
                }
                items={[
                  {
                    text: 'View Site',
                    onSelect: () => window.open('/', '_blank'),
                    icon: <Globe className="h-4 w-4 text-muted-foreground" />,
                  },
                  {
                    text: 'Log Out',
                    onSelect: handleLogout,
                    icon: <LogOut className="h-4 w-4 text-red-500" />,
                  },
                ]}
              />
            </div>
          </div>
        </nav>
        <div className="px-10 max-md:px-7 max-sm:px-4 w-full">
          {children}
        </div>
      </div>
    </div>
  )
}
