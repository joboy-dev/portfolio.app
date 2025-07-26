'use client'

import Loading from '@/app/loading'
import ContactForm from '@/components/messages/ContactForm'
import { ProjectCard } from '@/components/projects/Card'
import { DropdownButton } from '@/components/shared/button/DropdownButton'
import LinkButton from '@/components/shared/button/LinkButton'
import { SearchField } from '@/components/shared/form/SearchField'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { getFeaturedProjects, getProjects } from '@/lib/redux/slices/project/project'
import { GetProjectsParams } from '@/lib/redux/slices/project/project.service'
import { Filter, Star, User2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'

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

    return (
        <div>
            <ContactForm
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Let's Work Together"
                subtitle='Send me a message and let us discuss your next project.'
            />

            <section className='page-padding min-h-[80vh] flex flex-col items-center justify-center bg-secondary/50'>
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight text-center" >
                    <span className="text-foreground">My</span>
                    <br />
                    <span className="bg-gradient-primary bg-clip-text text-transparent">Projects</span>
                </h1>
                <p className='text-xl text-foreground/60 font-normal leading-relaxed text-center max-md:text-base max-w-3xl'>
                A showcase of my work spanning full-stack development, mobile applications, data visualization, and emerging technologies. Each project represents a unique challenge and innovative solution.
                </p>
            </section>

            <section className='py-8 px-[120px] max-md:px-8 min-h-[10vh] flex items-start justify-between gap-8 bg-background max-sm:flex-col max-sm:gap-4 max-sm:items-start'>
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
                    items={[]}
                />
            </section>

            {/* Projects */}
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    {(projects.length > 4 || searchQuery !== '') && (
                        <section className='page-padding bg-secondary/50'>
                            <div className='flex items-center gap-4 mb-8'>
                                <Star className='w-6 h-6 text-primary'/>
                                <h2 className='text-2xl font-bold'>Featured Projects</h2>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                {featuredProjects.map((project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* All Projects */}
                    {<section className='page-padding bg-secondary/50'>
                        <h2 className='text-3xl max-md:text-2xl max-sm:text-xl font-bold mb-8'>All Projects</h2>

                        {projects.length < 4 
                            ? <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                                {projects.map((project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                            : <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                                {otherProjects.map((project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        }
                    </section>}
                </>
            )}

            {/* Call to Action */}
            <section className="page-padding bg-gradient-primary">
                <div className="max-w-4xl mx-auto text-center pb-12">
                    <h2 className="text-4xl font-bold text-primary-foreground mb-6 text-center">Interested in Working Together?</h2>
                    <p className="text-xl text-primary-foreground/80 mb-10 max-w-3xl max mx-auto leading-relaxed font-semibold text-center">
                    I'm always excited to take on new challenges and create innovative solutions. Let's discuss your next project.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <LinkButton 
                            to="/about" 
                            size="lg" 
                            variant="ghost"
                            className="bg-white text-lg font-bold text-primary"
                        >
                        <User2 className="mr-2 h-5 w-5" />
                            Learn More About Me
                        </LinkButton>

                        <LinkButton
                            to="#"
                            onClick={() => setIsOpen(true)}
                            variant="outline"
                            size="lg"
                            className="border-2 border-white text-white px-8 py-4 text-lg font-bold"
                        >
                            Get In Touch
                        </LinkButton>
                    </div>
                </div>
            </section>
        </div>
    )
}
