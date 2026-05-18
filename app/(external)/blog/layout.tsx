import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/constants/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Blog',
  description:
    'Read insights and technical articles from Joboy Dev on software engineering, frontend, backend, and product development.',
  path: '/blog',
  keywords: ['developer blog', 'software engineering articles', 'frontend blog', 'backend blog', 'adegbehingbe oluwakorede joseph', 'oluwakorede adegbehingbe'],
})

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
