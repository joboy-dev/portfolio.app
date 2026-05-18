import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/constants/seo'

function slugToTitle(slug: string) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const projectTitle = slugToTitle(slug)

  return {
    title: `${projectTitle} Project`,
    description: `Project case study for ${projectTitle}: implementation details, outcomes, features, and technical decisions by Joboy Dev.`,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title: `${projectTitle} Project | ${SITE_NAME}`,
      description: `Project case study for ${projectTitle}.`,
      url: `${SITE_URL}/projects/${slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${projectTitle} Project | ${SITE_NAME}`,
      description: `Project case study for ${projectTitle}.`,
    },
  }
}

export default function ProjectSlugLayout({ children }: { children: React.ReactNode }) {
  return children
}
