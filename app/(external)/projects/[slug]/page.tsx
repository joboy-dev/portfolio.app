'use client'

import Skeleton, { SkeletonText } from '@/components/shared/Skeleton'
import { ProjectCard } from '@/components/projects/Card'
import Badge from '@/components/shared/Badge'
import LinkButton from '@/components/shared/button/LinkButton'
import ImageComponent from '@/components/shared/Image'
import NavigationBar, { Tab } from '@/components/shared/NavigationBar'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { ProjectInterface } from '@/lib/interfaces/project'
import { getProjectById, getProjects } from '@/lib/redux/slices/project/project'
import { filterImageFiles } from '@/lib/utils/file'
import { formatDate } from '@/lib/utils/formatter'
import MarkdownRenderer from '@/components/shared/MarkdownRenderer'
import clsx from 'clsx'
import { AlertCircleIcon, ArrowLeftIcon, ArrowRightIcon, Code2, CodeIcon, ExternalLink, InfoIcon, ListIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaFigma, FaGithub, FaGoogleDrive } from 'react-icons/fa6'
import Overview from './(tabs)/Overview'
import Features from './(tabs)/Features'
import Technical from './(tabs)/Technical'
import Challenges from './(tabs)/Challenges'
import Eyebrow from '@/components/shared/motion/Eyebrow'
import Reveal from '@/components/shared/motion/Reveal'

export default function ProjectDetailPage() {
    const { slug } = useParams()
    const dispatch = useAppDispatch()
    const { isLoading, selectedProject:project } = useAppSelector(state => state.project)
    const [similarProjects, setSimilarProjects] = useState<ProjectInterface[]>([])
    const [images, setImages] = useState<string[]>([])
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)

    useEffect(() => {
        dispatch(getProjectById({id: slug as string}))
    }, [dispatch, slug])

    // Runs once the project itself has loaded, so the tag-based query uses
    // this project's tags, not whatever project was loaded previously.
    useEffect(() => {
        if (!project?.id) return

        const tags = project.tags?.map((tag) => tag.name).join(',')

        dispatch(getProjects({
            page: 1,
            per_page: 4,
            sort_by: 'position',
            order: 'asc',
            tags,
        })).unwrap().then((response) => {
            const related = (response?.data ?? []).filter((p) => p.id !== project.id).slice(0, 3)
            setSimilarProjects(related)
        })
    }, [dispatch, project?.id])

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

    if (isLoading) {
        return (
            <div>
                <section className='page-padding min-h-dvh flex items-center max-md:flex-col-reverse gap-10 bg-secondary/60'>
                    <div className='flex flex-col gap-4 w-full'>
                        <Skeleton height='0.75rem' width='6rem' />
                        <div className='flex items-center gap-2'>
                            <Skeleton height='1.5rem' width='5rem' rounded='full' />
                            <Skeleton height='1.5rem' width='5rem' rounded='full' />
                        </div>
                        <Skeleton height='3rem' className='w-3/4' />
                        <SkeletonText lines={3} />
                        <div className='grid grid-cols-2 gap-4 max-sm:grid-cols-1'>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className='space-y-2'>
                                    <Skeleton height='1rem' width='6rem' />
                                    <Skeleton height='0.875rem' width='8rem' />
                                </div>
                            ))}
                        </div>
                        <div className='flex gap-2'>
                            <Skeleton height='2.5rem' width='8rem' rounded='md' />
                            <Skeleton height='2.5rem' width='8rem' rounded='md' />
                        </div>
                    </div>
                    <Skeleton className='w-full aspect-video' />
                </section>
            </div>
        )
    }

    return (
        <div>
            <section className='page-padding py-16 flex items-center max-md:flex-col-reverse max-md:items-start gap-10 bg-secondary/60'>
                <div className='flex flex-col gap-4 w-full'>
                    <Link
                        href='/projects'
                        className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-(--dur-fast) w-fit mb-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm'
                    >
                        <ArrowLeftIcon className='w-4 h-4' aria-hidden='true' />
                        Projects
                    </Link>
                    <Eyebrow>case-study</Eyebrow>
                    <div className="flex items-center gap-4 flex-wrap">
                        <Badge variant='secondary'>{project?.sector}</Badge>
                        <Badge variant='outlineSecondary'>{project?.role}</Badge>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight" >{project?.name}</h1>
                    <p className='text-lg max-md:text-base text-primary'>{project?.tagline}</p>
                    <MarkdownRenderer content={project?.description ?? ''} className='text-lg max-md:text-base text-muted-foreground' />

                    <dl className='flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground'>
                        {[
                            ['Type', project?.project_type],
                            ['Domain', project?.domain],
                            ['Client', project?.client],
                            ['Timeline', `${project?.start_date ? formatDate(project?.start_date) : 'N/A'} – ${project?.end_date ? formatDate(project?.end_date) : 'Present'}`],
                            ['Status', project?.status],
                        ].filter(([, value]) => !!value).map(([label, value], index, arr) => (
                            <React.Fragment key={label}>
                                <span>
                                    <dt className='inline font-medium text-foreground'>{label}: </dt>
                                    <dd className='inline'>{value}</dd>
                                </span>
                                {index < arr.length - 1 && <span aria-hidden='true' className='text-border'>·</span>}
                            </React.Fragment>
                        ))}
                    </dl>

                    <div className='flex flex-wrap gap-2 mt-2'>
                        {project?.live_link && (
                            <LinkButton to={project.live_link} variant='primary' className='max-sm:w-full'>
                                <ExternalLink className='w-4 h-4 mr-2' />
                                Live Site
                            </LinkButton>
                        )}

                        {project?.github_link && (
                            <LinkButton to={project.github_link} variant='outlineSecondary'>
                                <FaGithub className='w-4 h-4 mr-2' />
                                Visit Github
                            </LinkButton>
                        )}

                        {project?.figma_link && (
                            <LinkButton to={project.figma_link} variant='outlineSecondary'>
                                <FaFigma className='w-4 h-4 mr-2' />
                                Figma
                            </LinkButton>
                        )}

                        {project?.google_drive_link && (
                            <LinkButton to={project.google_drive_link} variant='outlineSecondary'>
                                <FaGoogleDrive className='w-4 h-4 mr-2' />
                                Google Drive
                            </LinkButton>
                        )}

                        {project?.postman_link && (
                            <LinkButton to={project.postman_link} variant='outlineSecondary'>
                                <Code2 className='w-4 h-4 mr-2' />
                                Postman
                            </LinkButton>
                        )}
                    </div>
                </div>
                <div
                    className='w-full h-full flex flex-col items-center justify-center gap-4'
                    role='group'
                    aria-roledescription='carousel'
                    aria-label={`${project?.name ?? 'Project'} screenshots`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowLeft' && currentImageIndex > 0) setCurrentImageIndex(currentImageIndex - 1)
                        if (e.key === 'ArrowRight' && currentImageIndex < images.length - 1) setCurrentImageIndex(currentImageIndex + 1)
                    }}
                >
                    <div className='w-full h-full flex items-center justify-center gap-2'>
                        <button
                            type='button'
                            aria-label='Previous screenshot'
                            disabled={currentImageIndex === 0}
                            onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                            className='h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-(--dur-fast) disabled:opacity-30 disabled:pointer-events-none max-sm:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
                        >
                            <ArrowLeftIcon className='w-5 h-5' aria-hidden='true' />
                        </button>
                        <ImageComponent
                            src={images[currentImageIndex] ?? '/images/placeholder.png'}
                            alt={`${project?.name ?? 'Project'} screenshot ${currentImageIndex + 1} of ${images.length}`}
                            objectFit='contain'
                            className='rounded-lg max-sm:w-full max-sm:h-full'
                            width={450}
                            height={300}
                        />
                        <button
                            type='button'
                            aria-label='Next screenshot'
                            disabled={currentImageIndex >= images.length - 1}
                            onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                            className='h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-(--dur-fast) disabled:opacity-30 disabled:pointer-events-none max-sm:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
                        >
                            <ArrowRightIcon className='w-5 h-5' aria-hidden='true' />
                        </button>
                    </div>
                    <div className='w-full h-full flex items-center justify-center gap-2 flex-wrap'>
                        {images.map((image, index) => (
                            <button
                                type='button'
                                key={index}
                                aria-label={`Show screenshot ${index + 1}`}
                                aria-current={currentImageIndex === index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={clsx(
                                    'rounded-sm outline-2 outline-offset-2 transition-[outline-color] duration-(--dur-fast)',
                                    currentImageIndex === index ? 'outline-primary' : 'outline-transparent'
                                )}
                            >
                                <ImageComponent
                                    src={image}
                                    alt=''
                                    width={75}
                                    height={75}
                                    objectFit='contain'
                                    className='rounded-sm'
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className='page-padding bg-background'>
                <NavigationBar tabs={tabs} defaultTab='overview' />
            </section>

           {similarProjects.length > 0 && <section className='page-padding'>
                <Reveal className='flex flex-col gap-4'>
                    <Eyebrow>related</Eyebrow>
                    <h2 className='text-4xl font-semibold tracking-tight'>Similar Projects</h2>
                    <p className='text-sm text-muted-foreground'>
                        These are some projects that are similar to {project?.name}
                    </p>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
                        {similarProjects.map((project, index) => (
                            <Reveal key={project.id} delay={Math.min(index * 0.08, 0.4)}>
                                <ProjectCard project={project} />
                            </Reveal>
                        ))}
                    </div>
                </Reveal>
            </section>}
        </div>
    )
}
