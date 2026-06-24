'use client'

import Loading from '@/app/loading'
import ContactForm from '@/components/messages/ContactForm'
import { ProjectCard } from '@/components/projects/Card'
import { DropdownButton } from '@/components/shared/button/DropdownButton'
import { SearchField } from '@/components/shared/form/SearchField'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { getFeaturedProjects, getProjects } from '@/lib/redux/slices/project/project'
import { GetProjectsParams } from '@/lib/redux/slices/project/project.service'
import { Filter, Star, User2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Option } from '@/lib/interfaces/general'
import ListEmpty from '@/components/shared/ListEmpty'
import Reveal from '@/components/shared/motion/Reveal'
import Eyebrow from '@/components/shared/motion/Eyebrow'
import CTASection from '@/components/shared/CTASection'

export default function ProjectsPage() {
    const { projects, featuredProjects, isLoading } = useAppSelector(state => state.project)
    const otherProjects = projects.filter(project => !featuredProjects.includes(project))
    const dispatch = useAppDispatch()
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [ filterState, setFilterState ] = useState<GetProjectsParams>({
        page: 1,
        per_page: 10,
        name: searchQuery,
    })

    useEffect(() => {
        if (featuredProjects.length === 0) {
            dispatch(getFeaturedProjects())
        }
        dispatch(getProjects({...filterState}))
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

            <section className='relative overflow-hidden page-padding min-h-[80vh] flex flex-col items-center justify-center bg-secondary/50'>
                <div className="hero-texture absolute inset-0 pointer-events-none" aria-hidden="true" />
                <Reveal className="relative flex flex-col items-center">
                    <Eyebrow>portfolio</Eyebrow>
                    <h1 className="text-5xl lg:text-7xl font-semibold mb-6 leading-tight tracking-tight text-center" >
                        <span className="text-foreground">My</span>
                        <br />
                        <span className="bg-gradient-primary bg-clip-text text-transparent">Projects</span>
                    </h1>
                    <p className='text-xl text-foreground/60 font-normal leading-relaxed text-center max-md:text-base max-w-3xl'>
                    A showcase of my work spanning full-stack development, mobile applications, data visualization, and emerging technologies. Each project represents a unique challenge and innovative solution.
                    </p>
                </Reveal>
            </section>

            <section className='nav-padding min-h-[10vh] flex items-start justify-between gap-8 bg-background max-sm:flex-col max-sm:gap-4 max-sm:items-start'>
                <SearchField
                    placeholder='Search projects'
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSearch={() => setFilterState({...filterState, name: searchQuery, page: 1})}
                    onSearchClear={() => dispatch(getProjects({}))}
                />

                <DropdownButton
                    buttonIcon={<Filter className='ml-3'/>}
                    buttonText='Filters'
                    size='sm'
                    items={projectDomain.map(domain => ({
                        text: domain.label,
                        onSelect: () => setFilterState({...filterState, domain: domain.value, page: 1})
                    }))}
                />
            </section>

            {/* Projects */}
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    {projects.length === 0 && <ListEmpty title='projects'/>}
                    {/* Featured Projects */}
                    {searchQuery === '' && projects.length > 4 && (
                        <section className='page-padding bg-secondary/50'>
                            <div className='flex items-center gap-4 mb-8'>
                                <Star className='w-6 h-6 text-primary'/>
                                <h2 className='text-2xl font-semibold'>Featured Projects</h2>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {featuredProjects.map((project, index) => (
                                    <Reveal key={project.id} delay={Math.min(index * 0.08, 0.4)}>
                                        <ProjectCard project={project} />
                                    </Reveal>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* All Projects */}
                    {projects.length > 0 && <section className='page-padding bg-secondary/50'>
                        <Eyebrow>{searchQuery === '' ? 'all-projects' : 'search-results'}</Eyebrow>
                        <h2 className='text-3xl max-md:text-2xl max-sm:text-xl font-semibold mb-8'>{searchQuery === '' ? 'All Projects' : 'Search Results'}</h2>

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
                </>
            )}

            <CTASection
                heading="Interested in Working Together?"
                subtitle="I am always excited to take on new challenges and create innovative solutions. Let us discuss your next project."
                primaryAction={{ label: "Learn More About Me", icon: <User2 className="ml-2 h-5 w-5 inline" />, to: "/about" }}
                secondaryAction={{ label: "Get In Touch", onClick: () => setIsOpen(true) }}
            />
        </div>
    )
}
