"use client"

import React, { useEffect, useState } from 'react'
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo'
import Button from './button/Button'
import { FaGreaterThan, FaLessThan } from 'react-icons/fa6'
import { X } from 'lucide-react'
import clsx from 'clsx'
import Link from 'next/link'
import { adminNavGroups } from '@/lib/constants/adminNav'
import { dur, ease, sheetVariantsLeft } from '@/lib/motion'

const COLLAPSE_STORAGE_KEY = 'admin-sidebar-collapsed'

function NavLinks({ isOpen, onNavigate }: { isOpen: boolean, onNavigate?: () => void }) {
    const pathname = usePathname()
    const isActive = (url: string) => pathname === url

    return (
        <div className='flex flex-col gap-6 mt-6'>
            {adminNavGroups.map((group) => (
                <div key={group.label} className='flex flex-col gap-1'>
                    {isOpen && (
                        <p className='eyebrow text-muted-foreground/70 px-3 mb-1'>
                            {group.label}
                        </p>
                    )}
                    {group.items.map((item) => (
                        <Link
                            href={item.url}
                            key={item.url}
                            title={item.title}
                            onClick={onNavigate}
                            aria-current={isActive(item.url) ? 'page' : undefined}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-(--dur-fast)",
                                isActive(item.url)
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                            )}
                        >
                            <item.icon className='w-5 h-5 shrink-0'/>
                            {isOpen && <p className='truncate'>{item.title}</p>}
                        </Link>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default function Sidebar({
    mobileOpen = false,
    onMobileClose,
}: {
    mobileOpen?: boolean
    onMobileClose?: () => void
}) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(true)
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
        try {
            const stored = localStorage.getItem(COLLAPSE_STORAGE_KEY)
            if (stored !== null) setIsOpen(stored !== 'true')
        } catch {
            // localStorage unavailable (private mode, etc.) — default stays expanded
        }
        setHydrated(true)
    }, [])

    const toggle = () => {
        setIsOpen((prev) => {
            const next = !prev
            try {
                localStorage.setItem(COLLAPSE_STORAGE_KEY, String(!next))
            } catch {
                // best-effort only
            }
            return next
        })
    }

    // Close the mobile sheet on route change, so a tap doesn't leave it open.
    useEffect(() => {
        onMobileClose?.()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname])

    return (
        <>
            {/* Desktop: persistent, collapsible rail */}
            <div className={clsx(
                "hidden md:flex sticky top-0 h-screen shrink-0 bg-background border-r border-border p-4 flex-col overflow-y-auto",
                "transition-[width] duration-(--dur-base) ease-(--ease-drawer)",
                hydrated && (isOpen ? "w-64" : "w-[72px]"),
                !hydrated && "w-64"
            )}>
                <div className={clsx("flex items-center", isOpen ? "gap-3" : "gap-0")}>
                    <Logo isCollapsed/>
                    {isOpen && (
                        <div className='min-w-0 flex-1 transition-opacity duration-(--dur-fast)'>
                            <div className="font-bold text-lg text-foreground truncate">
                                Joboy.dev
                            </div>
                            <div className="text-xs text-primary font-medium truncate">
                                Portfolio Manager
                            </div>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                        onClick={toggle}
                    >
                        {isOpen ? <FaLessThan className='w-[10px] h-[10px]'/> : <FaGreaterThan className='w-[10px] h-[10px]'/>}
                    </Button>
                </div>

                <NavLinks isOpen={isOpen} />
            </div>

            {/* Mobile: off-canvas sheet, opened from the top bar's hamburger */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            className='md:hidden fixed inset-0 z-(--z-overlay) bg-black/40'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: dur.fast }}
                            onClick={onMobileClose}
                            aria-hidden='true'
                        />
                        <motion.div
                            className='md:hidden fixed inset-y-0 left-0 z-(--z-modal) w-72 max-w-[80vw] bg-background border-r border-border p-4 flex flex-col overflow-y-auto'
                            initial={sheetVariantsLeft.initial}
                            animate={sheetVariantsLeft.animate}
                            exit={sheetVariantsLeft.exit}
                            transition={{ duration: dur.base, ease: ease.drawer }}
                            role='dialog'
                            aria-modal='true'
                            aria-label='Admin navigation'
                        >
                            <div className='flex items-center justify-between gap-3'>
                                <div className='flex items-center gap-3 min-w-0'>
                                    <Logo isCollapsed/>
                                    <div className='min-w-0'>
                                        <div className="font-bold text-lg text-foreground truncate">Joboy.dev</div>
                                        <div className="text-xs text-primary font-medium truncate">Portfolio Manager</div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" aria-label='Close menu' onClick={onMobileClose}>
                                    <X className='w-5 h-5' />
                                </Button>
                            </div>

                            <NavLinks isOpen onNavigate={onMobileClose} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
