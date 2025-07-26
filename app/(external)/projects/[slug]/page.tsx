'use client'

import { ProjectCard } from '@/components/projects/Card'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { ProjectInterface } from '@/lib/interfaces/project'
import { getProjects } from '@/lib/redux/slices/project/project'
import { projectsService } from '@/lib/redux/slices/project/project.service'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function ProjectDetailPage() {
    const { slug } = useParams()
    const dispatch = useAppDispatch()
    const { projects } = useAppSelector(state => state.project)
    const project = projects.find(project => project.slug === slug)
    const [similarProjects, setSimilarProjects] = useState<ProjectInterface[]>([])

    const getSimilarProjects = async () => {
        const { data } = await projectsService.getProjects({
            tags: project?.tags?.map((tag) => tag.name).join(','),
            page: 1,
            per_page: 3,
            sort_by: 'position',
            order: 'asc'
        })
        setSimilarProjects(data ?? [])
    }

    useEffect(() => {
        dispatch(getProjects({slug: slug as string}))
        getSimilarProjects()
    }, [slug, dispatch])

    return (
        <div>
            <section className='page-padding min-h-screen flex flex-col items-center justify-center gap-10'>
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight" >
                    {project?.name}
                </h1>
            </section>

           {similarProjects.length > 0 && <section className='page-padding'>
                <div className='flex flex-col gap-4'>
                    <h2 className='text-2xl font-bold'>Similar Projects</h2>
                    <p className='text-sm text-muted-foreground'>
                        These are some projects that are similar to {project?.name}
                    </p>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
                        {similarProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>
            </section>}
        </div>
    )
}
