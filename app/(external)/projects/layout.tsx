import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/constants/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Projects',
  description:
    'Explore full stack and frontend projects by Joboy Dev, including web apps, APIs, product builds, and technical case studies.',
  path: '/projects',
  keywords: ['developer projects', 'portfolio projects', 'full stack projects', 'frontend projects', 'adegbehingbe oluwakorede joseph', 'oluwakorede adegbehingbe'],
})

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children
}
