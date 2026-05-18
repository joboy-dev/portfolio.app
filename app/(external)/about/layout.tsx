import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/constants/seo'

export const metadata: Metadata = buildMetadata({
  title: 'About',
  description:
    'Learn more about Adegbehingbe Oluwakorede Joseph, including experience, education, certifications, and skills as a full stack developer.',
  path: '/about',
  keywords: ['about joboy dev', 'software engineer profile', 'developer experience', 'developer education', 'adegbehingbe oluwakorede joseph', 'oluwakorede adegbehingbe'],
})

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
