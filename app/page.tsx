'use client'

import ContactForm from "@/components/messages/ContactForm";
import Badge from "@/components/shared/Badge";
import LinkButton from "@/components/shared/button/LinkButton";
import Footer from "@/components/shared/Footer";
import PublicNavbar from "@/components/shared/navbar/PublicNavbar";
import { ArrowUpRight, Cpu, Download, Play, Rocket, Shield, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { FaEnvelope, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaWhatsapp, FaX } from "react-icons/fa6";
import { useAppSelector } from "@/lib/hooks/redux";
import Loading from "./loading";
import ImageComponent from "@/components/shared/Image";
import Card from "@/components/shared/card/Card";
import ProgressBar from "@/components/shared/ProgressBar";

export default function Home() {
  const { profile, isLoading:isProfileLoading } = useAppSelector(state => state.profile)
    const { skills, total:totalSkills } = useAppSelector(state => state.skill)
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

  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  return isProfileLoading ? <Loading /> : (
    <div>
      <ContactForm
        isOpen={isContactFormOpen}
        setIsOpen={setIsContactFormOpen}
        title="Contact Me"
        subtitle="Send me a message"
      />

      <PublicNavbar />

      {/* Hero Section */}
      <section className=" page-padding flex items-center justify-between min-h-screen mb-10 max-md:flex-col bg-secondary/50">
        <div className="flex flex-col justify-center items-start gap-8 w-[60%] max-md:w-full">
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
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight" >
              <span className="text-foreground">Crafting</span>
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">Digital</span>
              <br />
              <span className="text-foreground">Experiences</span>
            </h1>
            <p className="text-xl text-foreground/60 font-bold leading-relaxed max-w-lg">
              I'm a passionate software developer who transforms complex problems into elegant, scalable solutions.
              Let's build something extraordinary together.
            </p>
          </div>

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
              to="#"
              size='lg'
              variant='ghost'
              className="font-bold max-md:w-full"
            >
              <Download className='h-6 w-6 mr-5'/>
              Download CV
            </LinkButton>
          </div>

          <div className="grid grid-cols-4 gap-4 max-md:grid-cols-3 max-md:w-full max-md:justify-start max-md:items-center">
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

        <div className="relative w-[40%] max-md:w-full max-md:mt-10 bg-background rounded-lg border-primary/20 border-2">
          <div className="flex items-center justify-center">
            <div className="w-full bg-card-background shadow-lg rounded-lg p-10 grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.number}</div>
                  <div className="text-sm text-foreground/70 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl opacity-10 animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="page-padding mb-10">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl font-bold mb-6 text-secondary-foreground">Technology Stack</h2>
          <p className="text-foreground/80 text-lg">Expertise across modern technologies and frameworks</p>
        </div>

        <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4 mt-5">
          {skills.slice(0, 6).map((skill, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold mb-2 text-foreground">{skill.name}</h3>
                <Badge variant="primary" className="text-xs font-bold">
                  {skill.proficiency}%
                </Badge>
              </div>
              <ProgressBar value={skill.proficiency ?? 0} width="100%%" />
            </Card>
          ))}
        </div>
      </section>
      
      {/* Services Section */}
      <section className="page-padding bg-secondary/50">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl font-bold mb-6 text-secondary-foreground">What I Do</h2>
          <p className="text-foreground/80 text-lg">Comprehensive development services tailored to your needs</p>
        </div>

        <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4 mt-5">
          {services.map((service, index) => (
            <Card key={index} className="p-4" backgroundColor="bg-background">
              <ImageComponent 
                className="mb-4" 
                src={service.service_logo?.url ?? ''} 
                alt={service.name} 
                width={100} 
                height={100} 
                objectFit="fill"
              />
              <h3 className="text-2xl font-bold text-foreground mb-2">{service.name}</h3>
              <p className="text-;g text-muted-foreground mb-2">{service.description}</p>
              <ul className="space-y-2">
                  {(service.skills ?? []).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-foreground/70">
                      <div className="w-2 h-2 bg-gradient-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="page-padding bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center pb-12">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed font-semibold">
            Let's discuss how we can bring your ideas to life with cutting-edge technology and thoughtful design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LinkButton 
              to="#" 
              onClick={() => setIsContactFormOpen(true)}
              size="lg" 
              variant="ghost"
              className="bg-white text-lg font-medium">
              Start a Project
              <ArrowUpRight className="ml-2 h-5 w-5" />
            </LinkButton>

            <LinkButton
              to="/projects"
              variant="outline"
              size="lg"
              className="border-2 border-white text-white px-8 py-4 text-lg font-medium"
            >
              View Portfolio
            </LinkButton>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}