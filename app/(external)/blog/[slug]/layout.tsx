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
  const articleTitle = slugToTitle(slug)

  return {
    title: `${articleTitle} Blog`,
    description: `Article by Joboy Dev: ${articleTitle}. Practical software engineering insights and implementation notes.`,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: `${articleTitle} | ${SITE_NAME}`,
      description: `Article by Joboy Dev: ${articleTitle}.`,
      url: `${SITE_URL}/blog/${slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${articleTitle} | ${SITE_NAME}`,
      description: `Article by Joboy Dev: ${articleTitle}.`,
    },
  }
}

export default function BlogSlugLayout({ children }: { children: React.ReactNode }) {
  return children
}
