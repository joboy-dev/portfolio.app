"use client"

import {
    Award, Briefcase, BookOpen,
    FileText, FolderOpen, GraduationCap,
    LayoutDashboard, MessageSquare, Star, Trophy,
    Wrench
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { usePathname } from "next/navigation"
import Logo from './Logo'
import Button from './button/Button'
import { FaGreaterThan, FaLessThan } from 'react-icons/fa6'
import clsx from 'clsx'
import Link from 'next/link'

const menuGroups = [
    {
        label: "Overview",
        items: [
            { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
        ],
    },
    {
        label: "Portfolio",
        items: [
            { title: "Projects", url: "/admin/projects", icon: FolderOpen },
            { title: "Services", url: "/admin/services", icon: Wrench },
            { title: "Skills", url: "/admin/skills", icon: Award },
            { title: "Certifications", url: "/admin/certifications", icon: Award },
            { title: "Awards", url: "/admin/awards", icon: Trophy },
            { title: "Education", url: "/admin/education", icon: GraduationCap },
            { title: "Experience", url: "/admin/experience", icon: Briefcase },
        ],
    },
    {
        label: "Content",
        items: [
            { title: "Blog", url: "/admin/blog", icon: BookOpen },
            { title: "Testimonials", url: "/admin/testimonials", icon: Star },
        ],
    },
    {
        label: "Inbox",
        items: [
            { title: "Messages", url: "/admin/messages", icon: MessageSquare },
            { title: "Files", url: "/admin/files", icon: FileText },
        ],
    },
]

export default function Sidebar() {
    const pathname = usePathname()

    const isActive = (url: string) => pathname === url
    const [isOpen, setIsOpen] = useState(true)

    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsOpen(false)
        }
    }, [])

    return (
        <div className={clsx(
            "h-screen bg-background border-r border-border p-4 flex flex-col",
            isOpen ? "w-64 max-md:w-[100px]" : "w-[100px]",
            "overflow-y-scroll"
        )}>
            <div className={clsx(
                "flex items-center",
                isOpen ? "space-x-3" : "space-x-0"
            )}>
                <Logo isCollapsed/>
                {isOpen && (
                    <div className='max-md:hidden'>
                        <div className="font-bold text-lg text-foreground">
                            Joboy.dev
                        </div>
                        <div className="text-xs text-primary font-medium">
                            Portfolio Manager
                        </div>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(!isOpen)}
                    className='max-md:hidden'
                >
                    {isOpen ? <FaLessThan className='w-[10px] h-[10px] max-md:hidden'/> : <FaGreaterThan className='w-[10px] h-[10px] max-md:hidden'/>}
                </Button>
            </div>

            <div className='flex flex-col gap-6 mt-6'>
                {menuGroups.map((group) => (
                    <div key={group.label} className='flex flex-col gap-1'>
                        {isOpen && (
                            <p className='eyebrow text-muted-foreground/70 px-3 mb-1 max-md:hidden'>
                                {group.label}
                            </p>
                        )}
                        {group.items.map((item) => (
                            <Link
                                href={item.url}
                                key={item.url}
                                title={item.title}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive(item.url)
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                                )}
                            >
                                <item.icon className='w-5 h-5 shrink-0 max-md:w-[18px] max-md:h-[18px]'/>
                                {isOpen && <p className='max-md:hidden truncate'>{item.title}</p>}
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
