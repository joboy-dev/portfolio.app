import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Joboy-Dev Portfolio",
  description: "Portfolio for Adegbehingbe Oluwakorede Joseph",
  // // You can add more metadata for SEO, social sharing, and browser configuration.
  // // Here are some useful examples:

  // // The canonical URL for the site
  // // canonical: "https://joboy-dev.com",

  // // Open Graph metadata for social sharing
  // openGraph: {
  //   title: "Joboy-Dev Portfolio",
  //   description: "Portfolio for Adegbehingbe Oluwakorede Joseph",
  //   url: "https://joboy-dev.com",
  //   siteName: "Joboy-Dev Portfolio",
  //   images: [
  //     {
  //       url: "https://joboy-dev.com/og-image.png",
  //       width: 1200,
  //       height: 630,
  //       alt: "Joboy-Dev Portfolio",
  //     },
  //   ],
  //   locale: "en_US",
  //   type: "website",
  // },

  // // Twitter Card metadata
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Joboy-Dev Portfolio",
  //   description: "Portfolio for Adegbehingbe Oluwakorede Joseph",
  //   site: "@joboydev",
  //   creator: "@joboydev",
  //   images: ["https://joboy-dev.com/og-image.png"],
  // },

  // // Theme color for browsers
  // themeColor: "#0f172a",

  // // Favicon and icons (these are usually set in the <head> via <link> tags, but can be referenced here for completeness)
  // // icons: {
  // //   icon: "/favicon.ico",
  // //   shortcut: "/favicon-16x16.png",
  // //   apple: "/apple-touch-icon.png",
  // // },

  // // Robots meta tag for search engines
  // robots: {
  //   index: true,
  //   follow: true,
  //   googleBot: {
  //     index: true,
  //     follow: true,
  //     "max-snippet": -1,
  //     "max-image-preview": "large",
  //     "max-video-preview": -1,
  //   },
  // },

  // Manifest for PWA support (if applicable)
  // manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <html lang="en">
        <body className="bg-background">
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
