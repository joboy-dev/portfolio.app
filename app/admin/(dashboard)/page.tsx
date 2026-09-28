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
    Inbox,
    MessageSquare,
    PenLine,
    Star,
    Trophy,
    User,
} from "lucide-react"
import LinkButton from "@/components/shared/button/LinkButton"
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb"
import Badge from "@/components/shared/Badge"
import ListEmpty from "@/components/shared/ListEmpty"
import Skeleton from "@/components/shared/Skeleton"
import { formatDate } from "@/lib/utils/formatter"
import clsx from "clsx"

const RECENT_COUNT = 5

export default function AdminDashboardPage() {
    const dispatch = useAppDispatch()

    const { projects, total: projectsTotal, isLoading: projectsLoading } = useAppSelector((state) => state.project)
    const { blogs, total: blogTotal, isLoading: blogLoading } = useAppSelector((state) => state.blog)
    const { total: skillsTotal } = useAppSelector((state) => state.skill)
    const { total: certificationsTotal } = useAppSelector((state) => state.certification)
    const { total: testimonialsTotal } = useAppSelector((state) => state.testimonial)
    const { total: awardsTotal } = useAppSelector((state) => state.award)
    const { messages, total: messagesTotal, isLoading: messagesLoading } = useAppSelector((state) => state.message)

    useEffect(() => {
        dispatch(getProjects({ per_page: RECENT_COUNT, sort_by: 'created_at', order: 'desc' }))
        dispatch(getBlogs({ per_page: RECENT_COUNT }))
        dispatch(getSkills({ per_page: 1 }))
        dispatch(getCertifications({ per_page: 1 }))
        dispatch(getTestimonials({ per_page: 1 }))
        dispatch(getAwards({ per_page: 1 }))
        dispatch(getMessages({ per_page: RECENT_COUNT }))
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

    // Newest-first, project + blog interleaved by date, capped at RECENT_COUNT.
    const recentContent = [
        ...projects.map((p) => ({ id: p.id, title: p.name, type: 'Project' as const, href: '/admin/projects', is_published: p.is_published, created_at: p.created_at })),
        ...blogs.map((b) => ({ id: b.id, title: b.title, type: 'Blog' as const, href: '/admin/blog', is_published: b.is_published, created_at: b.created_at })),
    ]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, RECENT_COUNT)

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
                        className="!justify-start bg-background border border-border rounded-lg p-5 hover:border-primary/40 transition-colors duration-(--dur-fast)"
                    >
                        <div className="flex items-center gap-3 w-full">
                            <div className="flex items-center justify-center h-10 w-10 shrink-0 rounded-lg bg-primary/10">
                                <stat.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-mono font-tabular text-2xl font-semibold text-foreground">{stat.value ?? 0}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        </div>
                    </LinkButton>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
                <div className="bg-background rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between mb-4">
                        <p className="eyebrow text-muted-foreground">recent messages</p>
                        <LinkButton to="/admin/messages" variant="ghost" size="sm">View all</LinkButton>
                    </div>

                    {messagesLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-9 w-9 shrink-0" rounded="full" />
                                    <div className="flex-1 space-y-1.5">
                                        <Skeleton height="0.875rem" width="40%" />
                                        <Skeleton height="0.75rem" width="80%" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : messages.length === 0 ? (
                        <ListEmpty title="messages" subtitle="Messages from your contact form show up here." />
                    ) : (
                        <div className="divide-y divide-border">
                            {messages.slice(0, RECENT_COUNT).map((message) => (
                                <LinkButton
                                    key={message.id}
                                    to="/admin/messages"
                                    variant="ghost"
                                    size="none"
                                    className="!justify-start w-full py-3 first:pt-0 last:pb-0 !rounded-none"
                                >
                                    <div className="flex items-start gap-3 w-full min-w-0">
                                        <div className="flex items-center justify-center h-9 w-9 shrink-0 rounded-full bg-primary/10">
                                            <Inbox className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1 text-left">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-sm font-medium text-foreground truncate">{message.name}</p>
                                                <p className="text-xs text-muted-foreground shrink-0">{formatDate(message.created_at)}</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                                        </div>
                                    </div>
                                </LinkButton>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-background rounded-lg p-4 border border-border">
                    <p className="eyebrow text-muted-foreground mb-4">recent content</p>

                    {(projectsLoading || blogLoading) ? (
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-9 w-9 shrink-0" rounded="md" />
                                    <div className="flex-1 space-y-1.5">
                                        <Skeleton height="0.875rem" width="50%" />
                                        <Skeleton height="0.75rem" width="30%" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : recentContent.length === 0 ? (
                        <ListEmpty title="content" subtitle="New projects and blog posts show up here." />
                    ) : (
                        <div className="divide-y divide-border">
                            {recentContent.map((item) => (
                                <LinkButton
                                    key={`${item.type}-${item.id}`}
                                    to={item.href}
                                    variant="ghost"
                                    size="none"
                                    className="!justify-start w-full py-3 first:pt-0 last:pb-0 !rounded-none"
                                >
                                    <div className="flex items-center gap-3 w-full min-w-0">
                                        <div className={clsx(
                                            "flex items-center justify-center h-9 w-9 shrink-0 rounded-md",
                                            item.type === 'Project' ? "bg-primary/10" : "bg-accent"
                                        )}>
                                            {item.type === 'Project' ? <FolderOpen className="h-4 w-4 text-primary" /> : <BookOpen className="h-4 w-4 text-foreground/70" />}
                                        </div>
                                        <div className="min-w-0 flex-1 text-left">
                                            <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                                            <p className="text-xs text-muted-foreground">{item.type} · {formatDate(item.created_at)}</p>
                                        </div>
                                        <Badge variant={item.is_published ? 'primary' : 'outlineSecondary'} className="shrink-0 text-xs">
                                            {item.is_published ? 'Published' : 'Draft'}
                                        </Badge>
                                    </div>
                                </LinkButton>
                            ))}
                        </div>
                    )}
                </div>
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
