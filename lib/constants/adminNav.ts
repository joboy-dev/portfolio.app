import {
    Briefcase, BookOpen,
    FileText, FolderOpen, GraduationCap,
    LayoutDashboard, MessageSquare, Sparkles, Star, BadgeCheck,
    Trophy, Wrench, type LucideIcon,
} from 'lucide-react'

export interface AdminNavItem {
    title: string
    url: string
    icon: LucideIcon
}

export interface AdminNavGroup {
    label: string
    items: AdminNavItem[]
}

/** Shared by the Sidebar (nav + active state) and the top bar (page title
 *  lookup) so the two never drift out of sync with each other. */
export const adminNavGroups: AdminNavGroup[] = [
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
            { title: "Skills", url: "/admin/skills", icon: Sparkles },
            { title: "Certifications", url: "/admin/certifications", icon: BadgeCheck },
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

const flatNavItems = adminNavGroups.flatMap((group) => group.items)

/** Page title for the top bar, looked up by exact pathname. `/admin/profile`
 *  and other routes with no sidebar entry fall back to a small manual map. */
const extraTitles: Record<string, string> = {
    '/admin/profile': 'Profile Settings',
}

export function getAdminPageTitle(pathname: string): string {
    return flatNavItems.find((item) => item.url === pathname)?.title
        ?? extraTitles[pathname]
        ?? 'Admin'
}
