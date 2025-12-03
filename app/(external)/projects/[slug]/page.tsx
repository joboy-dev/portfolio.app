'use client'

import Loading from '@/app/loading'
import { ProjectCard } from '@/components/projects/Card'
import Badge from '@/components/shared/Badge'
import Button from '@/components/shared/button/Button'
import ImageComponent from '@/components/shared/Image'
import NavigationBar, { Tab } from '@/components/shared/NavigationBar'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { ProjectInterface } from '@/lib/interfaces/project'
import { getProjectById, getProjects } from '@/lib/redux/slices/project/project'
import { filterImageFiles } from '@/lib/utils/file'
import { formatDate } from '@/lib/utils/formatter'
import { renderWithLineBreaks } from '@/lib/utils/string'
import clsx from 'clsx'
import { AlertCircleIcon, ArrowLeftIcon, ArrowRightIcon, Code2, CodeIcon, ExternalLink, GithubIcon, InfoIcon, ListIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaFigma, FaGithub, FaGoogleDrive } from 'react-icons/fa6'
import Overview from './(tabs)/Overview'
import Features from './(tabs)/Features'
import Technical from './(tabs)/Technical'
import Challenges from './(tabs)/Challenges'

export default function ProjectDetailPage() {
    const { slug } = useParams()
    const dispatch = useAppDispatch()
    const { projects, isLoading, selectedProject:project } = useAppSelector(state => state.project)
    const [similarProjects, setSimilarProjects] = useState<ProjectInterface[]>([])
    const [images, setImages] = useState<string[]>([])
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)

    // const getSimilarProjects = async () => {
    //     const { data } = await projectsService.getProjects({
    //         page: 1,
    //         per_page: 3,
    //         sort_by: 'position',
    //         order: 'asc',
    //         tags: project?.tags?.map((tag) => tag.name).join(','),
    //     })
    //     const projectsWithoutCurrent = data?.filter((project) => project.id !== project?.id)
    //     setSimilarProjects(projectsWithoutCurrent ?? [])
    // }

    useEffect(() => {
        dispatch(getProjectById({id: slug as string}))
        dispatch(getProjects({
            page: 1,
            per_page: 3,
            sort_by: 'position',
            order: 'asc',
            tags: project?.tags?.map((tag) => tag.name).join(','),
        }))
        const projectsWithoutCurrent = projects?.filter((project) => project.id !== project?.id)
        setSimilarProjects(projectsWithoutCurrent ?? [])

        // getSimilarProjects()
    }, [dispatch, slug])
    // }, [slug, projects, project?.tags, dispatch])

    useEffect(() => {
        if (project && project.files) {
            const projectImages = filterImageFiles(project.files).sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
            if (projectImages.length > 0) {
                setImages(projectImages.map((file) => file.url ?? ''))
                setCurrentImageIndex(0)
            }
        }
    }, [project])

    const tabs: Tab[] = [
        {
            id: 'overview',
            label: 'Overview',
            content: <Overview />,
            icon: InfoIcon
        },
        {
            id: 'features',
            label: 'Features',
            content: <Features />,
            icon: ListIcon
        },
        {
            id: 'challenges',
            label: 'Challenges',
            content: <Challenges />,
            icon: AlertCircleIcon
        },
        {
            id: 'technical',
            label: 'Technical',
            content: <Technical />,
            icon: CodeIcon
        }
    ]

    return isLoading ? <Loading/> : (
        <div>
            <section className='page-padding min-h-screen flex items-center justify-center max-md:flex-col-reverse max-md:items-start max-md:justify-start gap-10 bg-secondary/60'>
                <div className='flex flex-col gap-4 w-full'>
                    <div className="flex items-center gap-4 flex-wrap">
                        <Badge variant='secondary'>{project?.sector}</Badge>
                        <Badge variant='outlineSecondary'>{project?.role}</Badge>
                    </div>
                    <h1 className="text-4xl max-md:text-2xl font-bold leading-tight" >{project?.name}</h1>
                    <p className='text-lg max-md:text-base text-primary'>{project?.tagline}</p>
                    <p className='text-lg max-md:text-base text-muted-foreground'>
                        {renderWithLineBreaks(project?.description ?? '')}
                    </p>
                    <div className='grid grid-cols-2 gap-4 max-sm:grid-cols-1'>
                        <div className='flex flex-col gap-2'>
                            <h2 className='text-lg font-bold'>Project Type</h2>
                            <p className='text-sm text-muted-foreground'>{project?.project_type}</p>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h2 className='text-lg font-bold'>Role</h2>
                            <p className='text-sm text-muted-foreground'>{project?.role}</p>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h2 className='text-lg font-bold'>Domain</h2>
                            <p className='text-sm text-muted-foreground'>{project?.domain}</p>
                        </div>
                        {project?.client && <div className='flex flex-col gap-2'>
                            <h2 className='text-lg font-bold'>Client</h2>
                            <p className='text-sm text-muted-foreground'>{project?.client}</p>
                        </div>}
                        <div className='flex flex-col gap-2'>
                            <h2 className='text-lg font-bold'>Timeline</h2>
                            <p className='text-sm text-muted-foreground'>{project?.start_date ? formatDate(project?.start_date) : 'N/A'} - {project?.end_date ? formatDate(project?.end_date) : 'Present'}</p>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h2 className='text-lg font-bold'>Status</h2>
                            <p className='text-sm text-muted-foreground'>{project?.status}</p>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        {project?.live_link && <Button
                            variant='primary'
                            className='max-sm:w-full'
                            onClick={() => window.open(project?.live_link ?? '', '_blank')}
                        >
                            <ExternalLink className='w-4 h-4 mr-2' />
                            Live Site
                        </Button>}

                        {project?.github_link && <Button
                            variant='outlineSecondary'
                            onClick={() => window.open(project?.github_link ?? '', '_blank')}
                        >
                            <FaGithub className='w-4 h-4 mr-2' />
                            Visit Github
                        </Button>}

                        {project?.figma_link && <Button
                            variant='outlineSecondary'
                            onClick={() => window.open(project?.figma_link ?? '', '_blank')}
                        >
                            <FaFigma className='w-4 h-4 mr-2' />
                            Figma
                        </Button>}

                        {project?.google_drive_link && <Button
                            variant='outlineSecondary'
                            onClick={() => window.open(project?.google_drive_link ?? '', '_blank')}
                        >
                            <FaGoogleDrive className='w-4 h-4 mr-2' />
                            Google Drive
                        </Button>}

                        {project?.postman_link && <Button
                            variant='outlineSecondary'
                            onClick={() => window.open(project?.postman_link ?? '', '_blank')}
                        >
                            <Code2 className='w-4 h-4 mr-2' />
                            Postman
                        </Button>}
                    </div>
                </div>
                <div className='w-full h-full flex flex-col items-center justify-center gap-4'>
                    <div className='w-full h-full flex items-center justify-center gap-2'>
                        {currentImageIndex > 0 && <ArrowLeftIcon 
                            className='w-4 h-4 cursor-pointer max-sm:hidden' 
                            onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                        />}
                        <ImageComponent 
                            src={images[currentImageIndex] ?? '/images/placeholder.png'} 
                            alt={project?.name ?? ''} 
                            objectFit='contain'
                            className='rounded-lg max-sm:w-full max-sm:h-full'
                            width={450}
                            height={300}
                        />
                       {currentImageIndex < images.length - 1 && <ArrowRightIcon 
                            className='w-4 h-4 cursor-pointer max-sm:hidden' 
                            onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                        />}
                    </div>
                    <div className='w-full h-full flex items-center justify-center gap-2 flex-wrap'>
                        {images.map((image, index) => (
                            <ImageComponent 
                                key={index}
                                src={image} 
                                alt={project?.name ?? ''} 
                                width={75}
                                height={75}
                                objectFit='cover'
                                className={clsx(
                                    'rounded-lg',
                                    currentImageIndex === index && 'border-3 border-primary'
                                )}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className='page-padding min-h-screen bg-background'>
                <NavigationBar tabs={tabs} defaultTab='overview' />
            </section>

           {similarProjects.length > 0 && <section className='page-padding min-h-screen'>
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
