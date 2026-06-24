'use client'

import React, { useEffect, useState } from 'react'
import { FaEnvelope, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaWhatsapp, FaX } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import ImageComponent from '@/components/shared/Image';
import { getProfile } from '@/lib/redux/slices/profile/profile';
import Loading from '@/app/loading';
import { Sparkles, Mail, User, Brain, Briefcase, GraduationCap, MessageCircle, Eye } from 'lucide-react';
import { Award } from 'lucide-react';
import LinkButton from '@/components/shared/button/LinkButton';
import Badge from '@/components/shared/Badge';
import ContactForm from '@/components/messages/ContactForm';
import NavigationBar from '@/components/shared/NavigationBar';
import Reveal from '@/components/shared/motion/Reveal';
import Eyebrow from '@/components/shared/motion/Eyebrow';
import CTASection from '@/components/shared/CTASection';
import AboutMe from './(tabs)/AboutMe';
import Skills from './(tabs)/Skills';
import Experience from './(tabs)/Experience';
import Education from './(tabs)/Education';
import Certifications from './(tabs)/Certifications';
import Awards from './(tabs)/Awards';
import Testimonials from './(tabs)/Testimonials';

export default function AboutPage() {
  const dispatch = useAppDispatch()
  const { profile, isLoading } = useAppSelector(state => state.profile)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    dispatch(getProfile())
  }, [dispatch])

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

  const tabs = [
    {
      id: 'about-me',
      label: 'About',
      content: <AboutMe />,
      icon: User
    },
    {
      id: 'skills',
      label: 'Skills',
      content: <Skills />,
      icon: Brain
    },
    {
      id: 'experience',
      label: 'Experience',
      content: <Experience />,
      icon: Briefcase
    },
    {
      id: 'education',
      label: 'Education',
      content: <Education />,
      icon: GraduationCap
    },
    {
      id: 'certifications',
      label: 'Certifications',
      content: <Certifications />,
      icon: Award
    },
    {
      id: 'awards',
      label: 'Awards',
      content: <Awards />,
      icon: Award
    },
    {
      id: 'testimonials',
      label: 'Testimonials',
      content: <Testimonials />,
      icon: MessageCircle
    }
  ]

  const defaultTab = 'about-me'

  return isLoading ? <Loading/> : (
    <div>
      <ContactForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Contact Me"
        subtitle="Let's build something extraordinary together."
      />

      <section className='relative overflow-hidden page-padding bg-secondary/50 min-h-screen flex max-md:flex-col items-center justify-between gap-10'>
          <div className="hero-texture absolute inset-0 pointer-events-none" aria-hidden="true" />

          <div className="relative w-[40%] aspect-4/5 max-md:w-full max-md:aspect-square max-md:mt-10 bg-background rounded-lg border-primary/20 border-2 flex items-center justify-center overflow-hidden">
              <ImageComponent
                  src={profile?.image_url ?? "#"}
                  alt="Profile Picture"
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  className="rounded-lg overflow-clip"
                  showImageInModalOnClick={true}
              />

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 max-md:w-16 max-md:h-16 bg-linear-to-br from-teal-400 to-emerald-500 rounded-2xl opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 max-md:w-24 max-md:h-24 bg-linear-to-br from-emerald-400 to-teal-500 rounded-2xl opacity-10 animate-pulse delay-1000"></div>
          </div>

          <div className="relative flex flex-col justify-center items-start gap-8 w-[60%] max-md:w-full">
            <div>
              <Badge
                variant="outline"
                useVariantStyles
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Available for freelance or contract work
              </Badge>
            </div>

            <div>
              <Eyebrow>about</Eyebrow>
              <h1 className="text-5xl lg:text-7xl font-semibold leading-tight tracking-tight" >
                <span className="text-foreground">{profile?.first_name}</span>
                <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">{profile?.last_name}</span>
              </h1>
              <p className="text-xl max-md:text-lg text-foreground/60 font-normal leading-relaxed max-w-lg mt-6">
                {profile?.title ?? "Software Engineer"}
              </p>
              <p className="text-lg max-md:text-base text-foreground/60 leading-relaxed max-w-lg mt-4">
                {profile?.short_bio ?? "I'm a passionate software developer who transforms complex problems into elegant, scalable solutions. Let's build something extraordinary together."}
              </p>
            </div>

            <div className="flex items-center gap-8 max-md:flex-col max-md:gap-4">
              <LinkButton
                to={profile?.resume_url ?? '#'}
                size='lg'
                variant='primary'
                className="font-bold max-md:w-full max-sm:text-sm"
              >
                <Eye className='h-6 w-6 mr-4 max-sm:h-4 max-sm:w-4'/>
                View Resume
              </LinkButton>

              <LinkButton
                to="#"
                onClick={() => setIsOpen(true)}
                size='lg'
                variant='ghostPrimary'
                className="font-bold border-2 border-foreground/20 max-md:w-full max-sm:text-sm"
              >
                <Mail className='h-6 w-6 mr-4 max-sm:h-4 max-sm:w-4'/>
                Contact Me
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
      </section>

      <section className='page-padding w-full bg-background min-h-[50vh] flex flex-col items-center justify-center gap-4'>
        <Reveal className="flex flex-col items-center text-center">
          <Eyebrow>profile</Eyebrow>
          <h2 className='text-4xl font-semibold text-center max-md:text-2xl'>Professional Profile</h2>
          <p className='text-xl text-foreground/60 font-normal leading-relaxed text-center max-md:text-sm'>Explore my journey, skills, and achievements</p>
        </Reveal>
        <NavigationBar tabs={tabs} defaultTab={defaultTab} />
      </section>

      <CTASection
        heading="Let us Work Together"
        subtitle="I am always interested in new opportunities and exciting projects. Let us discuss how we can bring your ideas to life."
        primaryAction={{
          label: "Start a Conversation",
          icon: <Mail className="ml-2 h-5 w-5 inline" />,
          onClick: () => setIsOpen(true),
        }}
        secondaryAction={{ label: "View My Work", to: "/projects" }}
      />
    </div>
  )
}
