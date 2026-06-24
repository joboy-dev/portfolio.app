"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { getProjects } from "@/lib/redux/slices/project/project"
import { getBlogs } from "@/lib/redux/slices/blog/blog"
import { getSkills } from "@/lib/redux/slices/skill/skill"
import { getCertifications } from "@/lib/redux/slices/certification/certification"
import { getTestimonials } from "@/lib/redux/slices/testimonial/testimonial"
import { getAwards } from "@/lib/redux/slices/award/award"
import { getMessages } from "@/lib/redux/slices/message/message"
import {
    Award,
    BookOpen,
    FolderOpen,
    MessageSquare,
    PenLine,
    Star,
    Trophy,
    User,
} from "lucide-react"
import LinkButton from "@/components/shared/button/LinkButton"
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb"

export default function AdminDashboardPage() {
    const dispatch = useAppDispatch()

    const { total: projectsTotal } = useAppSelector((state) => state.project)
    const { total: blogTotal } = useAppSelector((state) => state.blog)
    const { total: skillsTotal } = useAppSelector((state) => state.skill)
    const { total: certificationsTotal } = useAppSelector((state) => state.certification)
    const { total: testimonialsTotal } = useAppSelector((state) => state.testimonial)
    const { total: awardsTotal } = useAppSelector((state) => state.award)
    const { total: messagesTotal } = useAppSelector((state) => state.message)

    useEffect(() => {
        dispatch(getProjects({ per_page: 1 }))
        dispatch(getBlogs({ per_page: 1 }))
        dispatch(getSkills({ per_page: 1 }))
        dispatch(getCertifications({ per_page: 1 }))
        dispatch(getTestimonials({ per_page: 1 }))
        dispatch(getAwards({ per_page: 1 }))
        dispatch(getMessages({ per_page: 1 }))
    }, [dispatch])

    const stats = [
        { label: "Projects", value: projectsTotal, icon: FolderOpen, href: "/admin/projects" },
        { label: "Blog Posts", value: blogTotal, icon: BookOpen, href: "/admin/blog" },
        { label: "Skills", value: skillsTotal, icon: Award, href: "/admin/skills" },
        { label: "Certifications", value: certificationsTotal, icon: Award, href: "/admin/certifications" },
        { label: "Testimonials", value: testimonialsTotal, icon: Star, href: "/admin/testimonials" },
        { label: "Awards", value: awardsTotal, icon: Trophy, href: "/admin/awards" },
        { label: "Messages", value: messagesTotal, icon: MessageSquare, href: "/admin/messages" },
    ]

    const quickActions = [
        { label: "Add Project", icon: FolderOpen, href: "/admin/projects" },
        { label: "Write Blog Post", icon: PenLine, href: "/admin/blog" },
        { label: "View Messages", icon: MessageSquare, href: "/admin/messages" },
        { label: "Edit Profile", icon: User, href: "/admin/profile" },
    ]

    return (
        <div>
            <Breadcrumb title="Dashboard" subtitle="An overview of your portfolio content" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                {stats.map((stat) => (
                    <LinkButton
                        key={stat.label}
                        to={stat.href}
                        variant="ghost"
                        size="none"
                        className="!justify-start bg-background border border-border rounded-lg p-5 hover:border-primary/40 transition-colors"
                    >
                        <div className="flex items-center gap-3 w-full">
                            <div className="flex items-center justify-center h-10 w-10 shrink-0 rounded-lg bg-primary/10">
                                <stat.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-display text-2xl font-semibold text-foreground">{stat.value ?? 0}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        </div>
                    </LinkButton>
                ))}
            </div>

            <div className="bg-background rounded-lg p-4 mt-5 border border-border">
                <p className="eyebrow text-muted-foreground mb-4">quick actions</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {quickActions.map((action) => (
                        <LinkButton
                            key={action.label}
                            to={action.href}
                            variant="outlineSecondary"
                            size="md"
                            className="justify-start"
                        >
                            <action.icon className="h-4 w-4 mr-2" />
                            {action.label}
                        </LinkButton>
                    ))}
                </div>
            </div>
        </div>
    )
}
