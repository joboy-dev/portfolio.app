'use client'

import Link from "next/link"
import { ArrowUp, Mail, MapPin } from "lucide-react"
import { FaGithub, FaLinkedin, FaXTwitter, FaWhatsapp, FaInstagram } from "react-icons/fa6"
import Logo from "./Logo"
import { useAppSelector } from "@/lib/hooks/redux"

const exploreLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Blog", to: "/blog" },
]

function Footer() {
  const { profile } = useAppSelector((state) => state.profile)

  const socials = [
    { name: "GitHub", icon: <FaGithub className="h-4 w-4" />, url: profile?.github_url },
    { name: "LinkedIn", icon: <FaLinkedin className="h-4 w-4" />, url: profile?.linkedin_url },
    { name: "X (Twitter)", icon: <FaXTwitter className="h-4 w-4" />, url: profile?.twitter_url },
    { name: "Instagram", icon: <FaInstagram className="h-4 w-4" />, url: profile?.instagram_url },
    { name: "WhatsApp", icon: <FaWhatsapp className="h-4 w-4" />, url: profile?.whatsapp_url },
  ].filter((social) => !!social.url)

  const location = [profile?.city, profile?.country].filter(Boolean).join(", ")

  return (
    <footer className="w-full bg-secondary/40 border-t border-border">
      <div className="nav-padding pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {/* Brand + bio + socials */}
          <div className="flex flex-col gap-4 max-md:items-center max-md:text-center">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs">
              {profile?.short_bio ?? "Full-stack developer building scalable web products and thoughtful digital experiences."}
            </p>
            {socials.length > 0 && (
              <div className="flex items-center gap-2">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.name}
                    title={social.name}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-md text-muted-foreground border border-border hover:text-primary-strong hover:border-primary/40 transition-colors duration-(--dur-fast)"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-3 max-md:items-center max-md:text-center">
            <p className="eyebrow text-muted-foreground">Explore</p>
            <nav className="flex flex-col gap-2">
              {exploreLinks.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  className="text-sm text-foreground/70 hover:text-primary-strong transition-colors duration-(--dur-fast) w-fit max-md:mx-auto"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3 max-md:items-center max-md:text-center">
            <p className="eyebrow text-muted-foreground">Get in touch</p>
            <div className="flex flex-col gap-2">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary-strong transition-colors duration-(--dur-fast) w-fit max-md:mx-auto"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {profile.email}
                </a>
              )}
              {location && (
                <span className="flex items-center gap-2 text-sm text-foreground/70 w-fit max-md:mx-auto">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {location}
                </span>
              )}
              {profile?.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-primary-strong hover:underline underline-offset-2 w-fit max-md:mx-auto"
                >
                  Download résumé
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col-reverse md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} {profile?.full_name ?? "Adegbehingbe Oluwakorede"}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary-strong transition-colors duration-(--dur-fast)"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
