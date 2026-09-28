"use client"

import { usePathname } from 'next/navigation'
import { Globe, LogOut, Menu } from 'lucide-react'
import ThemeToggle from '../ThemeToggle'
import Avatar from '../Avatar'
import Button from '../button/Button'
import { DropdownButton } from '../button/DropdownButton'
import { getAdminPageTitle } from '@/lib/constants/adminNav'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { logout } from '@/lib/redux/slices/auth/auth'

export default function AdminTopBar({ onMenuClick }: { onMenuClick: () => void }) {
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const { profile } = useAppSelector((state) => state.profile)

    const handleLogout = () => dispatch(logout())

    return (
        <nav className='sticky top-0 z-(--z-nav) bg-background/95 backdrop-blur-sm border-b border-border h-16 shrink-0 flex items-center justify-between px-6 max-sm:px-4'>
            <div className='flex items-center gap-3 min-w-0'>
                <Button
                    variant='ghost'
                    size='sm'
                    className='md:hidden'
                    aria-label='Open menu'
                    onClick={onMenuClick}
                >
                    <Menu className='h-5 w-5' />
                </Button>
                <h1 className='text-lg font-semibold text-foreground truncate'>{getAdminPageTitle(pathname)}</h1>
            </div>

            <div className='flex items-center gap-2 shrink-0'>
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
        </nav>
    )
}
