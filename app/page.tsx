'use client'

import ContactForm from "@/components/messages/ContactForm";
import Badge from "@/components/shared/Badge";
import LinkButton from "@/components/shared/button/LinkButton";
import Footer from "@/components/shared/Footer";
import PublicNavbar from "@/components/shared/navbar/PublicNavbar";
import { ArrowUpRight, Cpu, Eye, Play, Rocket, Shield, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaEnvelope, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaWhatsapp, FaX } from "react-icons/fa6";
import { useAppSelector } from "@/lib/hooks/redux";
import Loading from "./loading";
import ImageComponent from "@/components/shared/Image";
import Card from "@/components/shared/card/Card";
import ProgressBar from "@/components/shared/ProgressBar";
import { SITE_URL } from "@/lib/constants/seo";
import { TypedLine, TypingCursor } from "@/components/shared/motion/TypewriterHeading";
import Reveal from "@/components/shared/motion/Reveal";
import Eyebrow from "@/components/shared/motion/Eyebrow";
import CTASection from "@/components/shared/CTASection";
import CodeWindow from "@/components/shared/CodeWindow";

export default function Home() {
  const { profile, isLoading:isProfileLoading } = useAppSelector(state => state.profile)
  const { skills } = useAppSelector(state => state.skill)
  const { services } = useAppSelector(state => state.service)

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
      icon: <FaX className="h-5 w-5" />,
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

  return isProfileLoading ? <Loading /> : (
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
              <TypedLine delay={0.1} className="text-foreground">Crafting</TypedLine>
              <br />
              <TypedLine delay={0.65} className="bg-gradient-primary bg-clip-text text-transparent">Digital</TypedLine>
              <br />
              <TypedLine delay={1.2} className="text-foreground">Experiences</TypedLine>
              <TypingCursor delay={1.75} />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.1, ease: [0.4, 0, 0.2, 1] }}
              className="text-xl text-foreground/60 font-medium leading-relaxed max-w-lg"
            >
              {profile?.short_bio || "I am a passionate software developer who transforms complex problems into elegant, scalable solutions. Let us build something extraordinary together."}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center gap-x-6 gap-y-2 flex-wrap font-mono text-sm text-muted-foreground"
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
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="relative w-[40%] max-md:w-full max-md:mt-10"
        >
          <CodeWindow
            name={profile?.full_name ?? `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim()}
            role={profile?.title ?? 'Software Engineer'}
            location={profile?.city && profile?.country ? `${profile.city}, ${profile.country}` : undefined}
            stack={skills.slice(0, 5).map((skill) => skill.name)}
          />

          {/* Floating Elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 max-md:w-16 max-md:h-16 bg-linear-to-br from-teal-400 to-emerald-500 rounded-2xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 max-md:w-24 max-md:h-24 bg-linear-to-br from-emerald-400 to-teal-500 rounded-2xl opacity-10 animate-pulse delay-1000"></div>
        </motion.div>
      </section>

      {/* Technology Stack Section */}
      <section className="page-padding">
        <Reveal className="flex flex-col items-center justify-center text-center">
          <Eyebrow>stack</Eyebrow>
          <h2 className="text-4xl font-semibold mb-6 text-secondary-foreground">Technology Stack</h2>
          <p className="text-foreground/80 text-lg">Expertise across modern technologies and frameworks</p>
        </Reveal>

        <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-6 mt-10">
          {skills.slice(0, 6).map((skill, index) => (
            <Reveal key={index} delay={Math.min(index * 0.08, 0.4)}>
              <Card>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{skill.name}</h3>
                  <Badge variant="primary" className="text-xs font-bold">
                    {skill.proficiency}%
                  </Badge>
                </div>
                <ProgressBar value={skill.proficiency ?? 0} width="100%%" />
              </Card>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {services.map((service, index) => (
            <Reveal key={index} delay={Math.min(index * 0.08, 0.4)}>
              <Card backgroundColor="bg-background" className="h-full">
              <ImageComponent
                className="mb-4"
                src={service.service_logo?.url ?? ''}
                alt={service.name}
                width={80}
                height={80}
                objectFit="contain"
              />
              <h3 className="text-lg font-semibold text-foreground mb-2">{service.name}</h3>
              <p className="text-lg text-muted-foreground mb-2">{service.description}</p>
              <ul className="space-y-2">
                  {(service.skills ?? []).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-foreground/70">
                      <div className="w-2 h-2 bg-gradient-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection
        heading="Ready to Start Your Project?"
        subtitle="Let us discuss how we can bring your ideas to life with cutting-edge technology and thoughtful design."
        primaryAction={{
          label: "Start a Project",
          icon: <ArrowUpRight className="ml-2 h-5 w-5 inline" />,
          onClick: () => setIsContactFormOpen(true),
        }}
        secondaryAction={{ label: "View Portfolio", to: "/projects" }}
      />
      <Footer />
    </div>
  )
}