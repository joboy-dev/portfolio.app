'use client'

import ContactForm from "@/components/messages/ContactForm";
import Badge from "@/components/shared/Badge";
import LinkButton from "@/components/shared/button/LinkButton";
import Footer from "@/components/shared/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import PublicNavbar from "@/components/shared/navbar/PublicNavbar";
import { ArrowUpRight, Cpu, Eye, Play, Rocket, Shield, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaEnvelope, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { getFeaturedProjects } from "@/lib/redux/slices/project/project";
import { ProjectCard } from "@/components/projects/Card";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";
import Skeleton, { SkeletonCard, SkeletonHero } from "@/components/shared/Skeleton";
import ImageComponent from "@/components/shared/Image";
import { SITE_URL } from "@/lib/constants/seo";
import { TypedLine, TypingCursor } from "@/components/shared/motion/TypewriterHeading";
import Reveal from "@/components/shared/motion/Reveal";
import { ease } from "@/lib/motion";
import Eyebrow from "@/components/shared/motion/Eyebrow";
import CTASection from "@/components/shared/CTASection";
import CodeWindow from "@/components/shared/CodeWindow";

export default function Home() {
  const dispatch = useAppDispatch()
  const { profile, isLoading:isProfileLoading } = useAppSelector(state => state.profile)
  const { skills } = useAppSelector(state => state.skill)
  const { services } = useAppSelector(state => state.service)
  const { featuredProjects } = useAppSelector(state => state.project)

  useEffect(() => {
    if (featuredProjects.length === 0) {
      dispatch(getFeaturedProjects())
    }
  }, [dispatch, featuredProjects.length])

  const stats = [
    { number: `${profile?.projects_count}`, label: "Projects Completed", icon: <Rocket className="h-5 w-5" /> },
    { number: `${new Date().getFullYear() - 2022}`, label: "Years Experience", icon: <Shield className="h-5 w-5" /> },
    { number: `${profile?.skills_count}`, label: "Technologies", icon: <Cpu className="h-5 w-5" /> },
    { number: "99%", label: "Client Satisfaction", icon: <Zap className="h-5 w-5" /> },
  ]

  const socials = [
    {
      name: "GitHub",
      icon: <FaGithub className="h-5 w-5" />,
      url: profile?.github_url,
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="h-5 w-5" />,
      url: profile?.linkedin_url,
    },
    {
      name: "Twitter",
      icon: <FaXTwitter className="h-5 w-5" />,
      url: profile?.twitter_url,
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp className="h-5 w-5" />,
      url: profile?.whatsapp_url,
    },
    {
      name: "Email",
      icon: <FaEnvelope className="h-5 w-5" />,
      url: `mailto:${profile?.email}`,
    },
    {
      name: "Instagram",
      icon: <FaInstagram className="h-5 w-5" />,
      url: profile?.instagram_url,
    },
    {
      name: "Facebook",
      icon: <FaFacebook className="h-5 w-5" />,
      url: profile?.facebook_url,
    }
  ]

  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Joboy Dev Portfolio",
    url: SITE_URL,
    description:
      "Portfolio of Adegbehingbe Oluwakorede Joseph, a full stack developer building scalable web products.",
    inLanguage: "en-US",
  }

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: (profile?.full_name ?? `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim()) || "Adegbehingbe Oluwakorede Joseph",
    url: SITE_URL,
    jobTitle: profile?.title ?? "Software Engineer",
    email: profile?.email ? `mailto:${profile.email}` : undefined,
    image: profile?.image_url,
    sameAs: [
      profile?.github_url,
      profile?.linkedin_url,
      profile?.twitter_url,
      profile?.instagram_url,
      profile?.facebook_url,
      profile?.website_url,
    ].filter(Boolean),
  }

  if (isProfileLoading) {
    return (
      <div>
        <PublicNavbar />
        <section className="page-padding min-h-dvh flex items-center bg-secondary/50">
          <SkeletonHero className="w-full" />
        </section>
        <section className="page-padding">
          <div className="flex flex-col items-center gap-3 mb-10">
            <Skeleton height="0.75rem" width="5rem" />
            <Skeleton height="2rem" width="16rem" />
          </div>
          <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} className="rounded-lg border border-border" />
            ))}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <ContactForm
        isOpen={isContactFormOpen}
        setIsOpen={setIsContactFormOpen}
        title="Contact Me"
        subtitle="Send me a message"
      />

      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden page-padding flex items-center justify-between min-h-screen max-md:flex-col bg-secondary/50">
        <div className="hero-texture absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative flex flex-col justify-center items-start gap-8 w-[60%] max-md:w-full">
          <div>
            <Badge
              variant="primary"
              useVariantStyles
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Available for freelance or contract work
            </Badge>
          </div>

          <div>
            <h1 className="text-5xl lg:text-7xl font-semibold mb-6 leading-tight tracking-tight">
              <TypedLine delay={0} className="text-foreground">Crafting</TypedLine>
              <br />
              <TypedLine delay={0.08} className="bg-gradient-primary bg-clip-text text-transparent">Digital</TypedLine>
              <br />
              <TypedLine delay={0.16} className="text-foreground">Experiences</TypedLine>
              <TypingCursor delay={0.3} />
            </h1>
            <motion.p
              initial={{ opacity: 0, transform: 'translateY(12px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              transition={{ duration: 0.4, delay: 0.3, ease: ease.out }}
              className="text-xl text-foreground/60 font-medium leading-relaxed max-w-lg"
            >
              {profile?.short_bio || "I am a passionate software developer who transforms complex problems into elegant, scalable solutions. Let's build something extraordinary together."}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, transform: 'translateY(12px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            transition={{ duration: 0.4, delay: 0.4, ease: ease.out }}
            className="flex items-center gap-x-6 gap-y-2 flex-wrap font-mono text-sm text-muted-foreground font-tabular"
          >
            {stats.map((stat, index) => (
              <span key={index} className="flex items-center gap-2">
                <span className="text-primary font-semibold">{stat.number}</span>
                {stat.label}
              </span>
            ))}
          </motion.div>

          <div className="flex items-center gap-8 max-md:flex-col">
            <LinkButton
              to="/projects"
              size='lg'
              variant='primary'
              className="font-bold max-md:w-full"
            >
              <Play className='h-6 w-6 mr-5'/>
              View My Work
            </LinkButton>

            <LinkButton
              to={profile?.resume_url ?? '#'}
              size='lg'
              variant='ghostPrimary'
              className="font-bold max-md:w-full"
            >
              <Eye className='h-6 w-6 mr-5'/>
              View Resume
            </LinkButton>
          </div>

          <div className="grid grid-cols-5 gap-4 max-md:grid-cols-4 max-sm:grid-cols-3 max-md:w-full max-md:justify-start max-md:items-center">
            {socials.filter(social => social.url !== undefined).map((social, index) => (
              <LinkButton 
                key={index} 
                to={social.url ?? '#'} 
                size='lg' 
                variant='ghost' 
                className="font-bold text-foreground/70"
                disabled={!social.url}
              >
                {social.icon}
              </LinkButton>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, transform: 'translateY(20px) scale(0.98)' }}
          animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
          transition={{ duration: 0.5, delay: 0.2, ease: ease.out }}
          className="relative w-[40%] max-md:w-full max-md:mt-10"
        >
          <CodeWindow
            name={profile?.full_name ?? `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim()}
            role={profile?.title ?? 'Software Engineer'}
            location={profile?.city && profile?.country ? `${profile.city}, ${profile.country}` : undefined}
            stack={skills.slice(0, 5).map((skill) => skill.name)}
          />
        </motion.div>
      </section>

      {/* About teaser */}
      <section className="page-padding">
        <div className="flex items-start gap-16 max-lg:flex-col max-lg:gap-8">
          <Reveal className="flex-1">
            <Eyebrow>about</Eyebrow>
            <h2 className="text-4xl font-semibold mb-6 text-secondary-foreground">
              Hi, I&apos;m {profile?.first_name ?? "there"}
            </h2>
            {profile?.about ? (
              <MarkdownRenderer
                content={profile.about}
                className="text-lg text-foreground/70 leading-relaxed line-clamp-6"
              />
            ) : (
              <p className="text-lg text-foreground/70 leading-relaxed">
                {profile?.short_bio ?? "I build reliable, scalable software end to end, from database design to pixel-level UI polish."}
              </p>
            )}
            <LinkButton to="/about" variant="ghostPrimary" size="md" className="font-bold mt-6">
              More about me
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </LinkButton>
          </Reveal>

          <Reveal delay={0.1} className="flex-1 w-full grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 rounded-lg border border-border bg-secondary/40">
                <div className="text-primary mb-2">{stat.icon}</div>
                <p className="text-3xl font-display font-semibold text-foreground font-tabular">{stat.number}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Selected Work */}
      {featuredProjects.length > 0 && (
        <section className="page-padding bg-secondary/50">
          <Reveal className="flex flex-col items-center justify-center text-center">
            <Eyebrow>selected work</Eyebrow>
            <h2 className="text-4xl font-semibold mb-6 text-secondary-foreground">Recent Projects</h2>
            <p className="text-foreground/80 text-lg">A few things I&apos;ve shipped recently</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {featuredProjects.slice(0, 3).map((project, index) => (
              <Reveal key={project.id} delay={Math.min(index * 0.08, 0.4)}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <LinkButton to="/projects" variant="outline" size="md" className="font-bold">
              View all projects
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </LinkButton>
          </div>
        </section>
      )}

      {/* Technology Stack Section */}
      <section className="page-padding">
        <Reveal className="flex flex-col items-center justify-center text-center">
          <Eyebrow>stack</Eyebrow>
          <h2 className="text-4xl font-semibold mb-6 text-secondary-foreground">Technology Stack</h2>
          <p className="text-foreground/80 text-lg">Expertise across modern technologies and frameworks</p>
        </Reveal>

        <div className="grid grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2 gap-4 mt-10">
          {skills.slice(0, 12).map((skill, index) => (
            <Reveal key={index} delay={Math.min(index * 0.05, 0.4)}>
              <div className="flex flex-col items-center justify-center gap-3 p-5 rounded-lg border border-border bg-secondary/40 h-full">
                <ImageComponent
                  src={skill.skill_logo?.url ?? ''}
                  alt={skill.name}
                  width={40}
                  height={40}
                  objectFit="contain"
                />
                <p className="text-sm font-medium text-foreground text-center">{skill.name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="page-padding bg-secondary/50">
        <Reveal className="flex flex-col items-center justify-center text-center">
          <Eyebrow>services</Eyebrow>
          <h2 className="text-4xl font-semibold mb-6 text-secondary-foreground">What I Do</h2>
          <p className="text-foreground/80 text-lg">Comprehensive development services tailored to your needs</p>
        </Reveal>

        <div className="max-w-4xl mx-auto mt-10 divide-y divide-border">
          {services.map((service, index) => (
            <Reveal key={index} delay={Math.min(index * 0.08, 0.4)}>
              <div className="flex items-start my-4 gap-8 max-md:flex-col max-md:gap-4 py-8 first:pt-0 last:pb-0">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <ImageComponent
                    src={service.service_logo?.url ?? ''}
                    alt={service.name}
                    width={40}
                    height={40}
                    objectFit="contain"
                    className="shrink-0"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{service.name}</h3>
                    <p className="text-base text-muted-foreground">{service.description}</p>
                  </div>
                </div>
                {(service.skills ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-2 md:max-w-[45%] md:justify-end">
                    {(service.skills ?? []).map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection
        heading="Ready to Start Your Project?"
        subtitle="Let's discuss how we can bring your ideas to life with the right technology and thoughtful design."
        primaryAction={{
          label: "Start a Project",
          icon: <ArrowUpRight className="ml-2 h-5 w-5 inline" />,
          onClick: () => setIsContactFormOpen(true),
        }}
        secondaryAction={{ label: "View Portfolio", to: "/projects" }}
      />
      <Footer />
      <WhatsAppButton />
    </div>
  )
}