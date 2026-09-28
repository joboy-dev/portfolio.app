'use client'

import ContactForm from '@/components/messages/ContactForm'
import { ProjectCard } from '@/components/projects/Card'
import { SearchField } from '@/components/shared/form/SearchField'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { getFeaturedProjects, getProjects } from '@/lib/redux/slices/project/project'
import { GetProjectsParams } from '@/lib/redux/slices/project/project.service'
import { Star, User2 } from 'lucide-react'
import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { Option } from '@/lib/interfaces/general'
import ListEmpty from '@/components/shared/ListEmpty'
import { SkeletonProjectCard } from '@/components/shared/Skeleton'
import Reveal from '@/components/shared/motion/Reveal'
import Eyebrow from '@/components/shared/motion/Eyebrow'
import CTASection from '@/components/shared/CTASection'

export default function ProjectsPage() {
    const { projects, featuredProjects, isLoading } = useAppSelector(state => state.project)
    const otherProjects = projects.filter(project => !featuredProjects.includes(project))
    const dispatch = useAppDispatch()
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeDomain, setActiveDomain] = useState<string | undefined>(undefined)
    const hasLoadedOnce = useRef(false)
    const [filterState, setFilterState] = useState<GetProjectsParams>({
        page: 1,
        per_page: 10,
        name: searchQuery,
        is_published: true,
    })

    useEffect(() => {
        if (featuredProjects.length === 0) {
            dispatch(getFeaturedProjects())
        }
        dispatch(getProjects({...filterState})).finally(() => { hasLoadedOnce.current = true })
    }, [dispatch, filterState])

    const projectDomain: Option[] = [
        {
            label: "Web Development",
            value: "Web Development",
            key: 0,
        },
        {
            label: "Mobile Development",
            value: "Mobile Development",
            key: 1,
        },
        {
            label: "Backend Development",
            value: "Backend Development",
            key: 2,
        },
        {
            label: "Frontend Development",
            value: "Frontend Development",
            key: 3,
        },
        {
            label: "Full Stack Development",
            value: "Full Stack Development",
            key: 4,
        },
        {
            label: "Data Science",
            value: "Data Science",
            key: 5,
        },
        {
            label: "AI & ML",
            value: "AI & ML",
            key: 6,
        },
        {
            label: "Blockchain",
            value: "Blockchain",
            key: 7,
        },
        {
            label: "DevOps",
            value: "DevOps",
            key: 8,
        },
        {
            label: "Cybersecurity",
            value: "Cybersecurity",
            key: 9,
        },
        {
            label: "Other",
            value: "Other",
            key: 10,
        }
    ]

    return (
        <div>
            <ContactForm
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Let's Work Together"
                subtitle='Send me a message and let us discuss your next project.'
            />

            <section className='relative overflow-hidden nav-padding min-h-[50vh] flex flex-col justify-center bg-secondary/50'>
                <div className="hero-texture absolute inset-0 pointer-events-none" aria-hidden="true" />
                <Reveal className="relative max-w-2xl">
                    <Eyebrow>portfolio</Eyebrow>
                    <h1 className="text-5xl md:text-6xl font-semibold mb-4 leading-tight tracking-tight text-foreground" >
                        Projects
                    </h1>
                    <p className='text-lg text-foreground/60 font-normal leading-relaxed max-md:text-base'>
                    A showcase of my work spanning full-stack development, mobile applications, and emerging technologies.
                    </p>
                </Reveal>
            </section>

            <section className='sticky top-16 z-30 nav-padding py-4 flex items-center justify-between gap-4 bg-background/95 backdrop-blur-sm border-b border-border max-sm:flex-col max-sm:items-stretch'>
                <SearchField
                    placeholder='Search projects'
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSearch={() => setFilterState({...filterState, name: searchQuery, page: 1})}
                    onSearchClear={() => setFilterState({...filterState, name: '', page: 1})}
                />

                <div className='flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 [scrollbar-width:none]'>
                    <button
                        type='button'
                        onClick={() => { setActiveDomain(undefined); setFilterState({...filterState, domain: undefined, page: 1}) }}
                        className={clsx(
                            'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-(--dur-fast)',
                            activeDomain === undefined ? 'bg-primary-strong text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                        )}
                    >
                        All
                    </button>
                    {projectDomain.map(domain => (
                        <button
                            key={domain.key}
                            type='button'
                            onClick={() => { setActiveDomain(domain.value); setFilterState({...filterState, domain: domain.value, page: 1}) }}
                            className={clsx(
                                'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-(--dur-fast)',
                                activeDomain === domain.value ? 'bg-primary-strong text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {domain.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Projects */}
            {isLoading && !hasLoadedOnce.current ? (
                <section className='page-padding bg-secondary/50'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <SkeletonProjectCard key={index} />
                        ))}
                    </div>
                </section>
            ) : (
                <div className={clsx('transition-opacity duration-(--dur-base)', isLoading ? 'opacity-60' : 'opacity-100')} aria-busy={isLoading}>
                    {projects.length === 0 && <ListEmpty title='projects'/>}
                    {/* Featured Projects */}
                    {searchQuery === '' && projects.length > 4 && (
                        <section className='page-padding bg-secondary/50'>
                            <div className='flex items-center gap-4 mb-8'>
                                <Star className='w-6 h-6 text-primary'/>
                                <h2 className='text-2xl font-semibold'>Featured Projects</h2>
                            </div>
                            {featuredProjects.length >= 3 ? (
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:auto-rows-[1fr]'>
                                    <Reveal className='md:row-span-2'>
                                        <ProjectCard project={featuredProjects[0]} />
                                    </Reveal>
                                    {featuredProjects.slice(1).map((project, index) => (
                                        <Reveal key={project.id} delay={Math.min((index + 1) * 0.08, 0.4)}>
                                            <ProjectCard project={project} />
                                        </Reveal>
                                    ))}
                                </div>
                            ) : (
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                    {featuredProjects.map((project, index) => (
                                        <Reveal key={project.id} delay={Math.min(index * 0.08, 0.4)}>
                                            <ProjectCard project={project} />
                                        </Reveal>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* All Projects */}
                    {projects.length > 0 && <section className='page-padding bg-secondary/50'>
                        <Eyebrow>{searchQuery === '' ? 'all-projects' : 'search-results'}</Eyebrow>
                        <div className='flex items-baseline justify-between flex-wrap gap-2 mb-8'>
                            <h2 className='text-3xl max-md:text-2xl max-sm:text-xl font-semibold'>{searchQuery === '' ? 'All Projects' : 'Search Results'}</h2>
                            <p className='text-sm text-muted-foreground'>{projects.length} project{projects.length === 1 ? '' : 's'}</p>
                        </div>

                        {(searchQuery !== '' || projects.length < 4)
                            ? <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {projects.map((project, index) => (
                                    <Reveal key={project.id} delay={Math.min(index * 0.08, 0.4)}>
                                        <ProjectCard project={project} />
                                    </Reveal>
                                ))}
                            </div>
                            : <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {otherProjects.map((project, index) => (
                                    <Reveal key={project.id} delay={Math.min(index * 0.08, 0.4)}>
                                        <ProjectCard project={project} />
                                    </Reveal>
                                ))}
                            </div>
                        }
                    </section>}
                </div>
            )}

            <CTASection
                heading="Interested in Working Together?"
                subtitle="I'm always excited to take on new challenges. Let's discuss your next project."
                primaryAction={{ label: "Learn More About Me", icon: <User2 className="ml-2 h-5 w-5 inline" />, to: "/about" }}
                secondaryAction={{ label: "Get In Touch", onClick: () => setIsOpen(true) }}
            />
        </div>
    )
}
