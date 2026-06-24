import type { Metadata } from 'next'

export const SITE_URL = 'https://joboydev.vercel.app'
export const SITE_NAME = 'Oluwakorede Joseph Adegbehingbe Portfolio'
export const DEFAULT_TITLE = 'Oluwakorede Joseph Adegbehingbe | Full Stack Developer'
export const DEFAULT_DESCRIPTION =
  'Portfolio of Adegbehingbe Oluwakorede Joseph, a full stack developer building scalable web applications, APIs, and product-focused digital experiences.'
export const DEFAULT_OG_IMAGE = '/favicon/favicon.ico'

export function buildMetadata({
  title,
  description,
  path = '/',
  keywords = [],
}: {
  title?: string
  description?: string
  path?: string
  keywords?: string[]
}): Metadata {
  const resolvedTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
  const resolvedDescription = description ?? DEFAULT_DESCRIPTION
  const url = `${SITE_URL}${path}`

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    icons: {
        icon: "/favicon/favicon.ico",
        shortcut: "/favicon/favicon-16x16.png",
        apple: "/favicon/apple-touch-icon.png",
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images: [DEFAULT_OG_IMAGE],
    },
  }
}