'use client'

import React, { useEffect, useState } from 'react'
import { FaEnvelope, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaWhatsapp, FaX } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import ImageComponent from '@/components/shared/Image';
import { getProfile } from '@/lib/redux/slices/profile/profile';
import Loading from '@/app/loading';
import { Sparkles, Download, Mail, User, Brain, Briefcase, GraduationCap, MessageCircle } from 'lucide-react';
import { Award } from 'lucide-react';
import LinkButton from '@/components/shared/button/LinkButton';
import Badge from '@/components/shared/Badge';
import ContactForm from '@/components/messages/ContactForm';
import NavigationBar from '@/components/shared/NavigationBar';
import AboutMe from './(tabs)/AboutMe';
import Skills from './(tabs)/Skills';
import Experience from './(tabs)/Experience';
import Education from './(tabs)/Education';
import Certifications from './(tabs)/Certifications';


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
      url: profile?.email,
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
      label: 'About Me',
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
      content: <div>Awards</div>,
      icon: Award
    },
    {
      id: 'testimonials',
      label: 'Testimonials',
      content: <div>Testimonials</div>,
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

      <section className='page-padding bg-secondary/50 min-h-screen flex max-md:flex-col items-center justify-between gap-10'>
          <div className="relative w-[45%] h-[80%] max-md:w-full max-md:mt-10 bg-background rounded-lg border-primary/20 border-2 flex items-center justify-center">
              <ImageComponent
                  src={profile?.image_url ?? ''} 
                  alt="Profile Picture" 
                  width="100%"
                  height="100%" 
                  objectFit="cover"
                  className="rounded-lg overflow-clip"
                  showImageInModalOnClick={true}
              />

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl opacity-10 animate-pulse delay-1000"></div>
          </div>

          <div className="flex flex-col justify-center items-start gap-8 w-[50%] max-md:w-full">
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
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight" >
                <span className="text-foreground">{profile?.first_name}</span>
                <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">{profile?.last_name}</span>
              </h1>
              <p className="text-2xl text-foreground/60 font-normal leading-relaxed max-w-lg">
                {profile?.title ?? "Software Engineer"}
              </p>
              <p className="text-xl text-foreground/60 font-bold leading-relaxed max-w-lg">
                {profile?.short_bio ?? "I'm a passionate software developer who transforms complex problems into elegant, scalable solutions. Let's build something extraordinary together."}
              </p>
            </div>

            <div className="flex items-center gap-8 max-md:flex-col max-md:gap-4">
              <LinkButton
                to={profile?.resume_url ?? '#'}
                size='lg'
                variant='primary'
                className="font-bold max-md:w-full"
              >
                <Download className='h-6 w-6 mr-5'/>
                Download Resume
              </LinkButton>

              <LinkButton
                to="#"
                onClick={() => setIsOpen(true)}
                size='lg'
                variant='ghost'
                className="font-bold max-md:w-full"
              >
                <Mail className='h-6 w-6 mr-5'/>
                Contact Me
              </LinkButton>
            </div>

            <div className="grid grid-cols-5 gap-4 max-md:grid-cols-4 max-md:w-full max-md:justify-start max-md:items-center">
              {socials.filter(social => social.url !== undefined).map((social, index) => (
                <LinkButton 
                  key={index} 
                  to={social.url || '#'} 
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

      <section className='page-padding w-full bg-background min-h-screen flex flex-col items-center justify-cstartenter gap-4'>
        <h2 className='text-4xl font-bold text-center max-md:text-2xl'>Professional Profile</h2>
        <p className='text-xl text-foreground/60 font-normal leading-relaxed text-center max-md:text-sm'>Explore my journey, skills, and achievements</p>
        <NavigationBar tabs={tabs} defaultTab={defaultTab} />
      </section>
    </div>
  )
}
