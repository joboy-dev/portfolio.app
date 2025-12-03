"use client"

import Button from '@/components/shared/button/Button'
import Sidebar from '@/components/shared/Sidebar'
import { useAppDispatch } from '@/lib/hooks/redux'
import { logout } from '@/lib/redux/slices/auth/auth'
import type React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

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
              <Button 
                variant='dangerOutline' 
                size='sm'
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </nav>
        <div className="px-10 w-full">
          {children}
        </div>
      </div>
    </div>
  )
}
