'use client'

import React, { useEffect, useState } from 'react'
import { FaEnvelope, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaWhatsapp, FaX } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import ImageComponent from '@/components/shared/Image';
import { getSkills } from '@/lib/redux/slices/skill/skill';
import { getServices } from '@/lib/redux/slices/service/service';
import { getProfile } from '@/lib/redux/slices/profile/profile';
import { getExperiences } from '@/lib/redux/slices/experience/experience';
import { getEducations } from '@/lib/redux/slices/education/education';
import { getAwards } from '@/lib/redux/slices/award/award';
import { getCertifications } from '@/lib/redux/slices/certification/certification';
import Loading from '@/app/loading';

export default function AboutPage() {
  const dispatch = useAppDispatch()
  const { profile } = useAppSelector(state => state.profile)
  const { skills } = useAppSelector(state => state.skill)
  const { services } = useAppSelector(state => state.service)
  const { experiences } = useAppSelector(state => state.experience)
  const { educations } = useAppSelector(state => state.education)
  const { certifications } = useAppSelector(state => state.certification)
  const { awards } = useAppSelector(state => state.award)
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    setIsLoading(true)
    if(!profile) {
      dispatch(getProfile())
    }
    if(!skills) {
      dispatch(getSkills({}))
    }
    if(!services) {
      dispatch(getServices({}))
    }
    if(!experiences) {
      dispatch(getExperiences({}))
    }
    if(!educations) {
      dispatch(getEducations({}))
    }
    if(!certifications) {
      dispatch(getCertifications({}))
    }
    if(!awards) {
      dispatch(getAwards({}))
    }
    setIsLoading(false)
  }, [profile, skills, services, experiences, educations, certifications, awards])

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
  return isLoading ? <Loading/> : (
    <div>
        <section className='page-padding bg-secondary/50 min-h-screen flex max-md:flex-col items-center justify-between gap-10'>
            <div className="relative w-[60%] h-[80vh] max-md:w-full max-md:mt-10 bg-background rounded-lg border-primary/20 border-2 flex items-center justify-center">
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

            <div className="w-[40%] max-md:w-full max-md:mt-10">
                <h1 className="text-4xl font-bold mb-6 text-secondary-foreground">About Me</h1>
                <p className="text-foreground/80 text-lg">
                    I'm a passionate software developer who transforms complex problems into elegant, scalable solutions.
                    Let's build something extraordinary together.
                </p>
            </div>
        </section>
    </div>
  )
}
