'use client'

import React from 'react'
import Link from 'next/link'
import Card from '../shared/card/Card'
import { ProjectInterface } from '@/lib/interfaces/project'
import ImageComponent from '../shared/Image'
import Badge from '../shared/Badge'
import { Code2, Eye } from 'lucide-react'
import { FaFigma, FaGithub, FaGlobe, FaGoogleDrive } from 'react-icons/fa6'
import LinkButton from '../shared/button/LinkButton'
import MarkdownRenderer from '../shared/MarkdownRenderer'

const externalLinks = [
    { key: 'live_link' as const, label: 'Live site', icon: <FaGlobe className='w-4 h-4' /> },
    { key: 'github_link' as const, label: 'GitHub repository', icon: <FaGithub className='w-4 h-4' /> },
    { key: 'figma_link' as const, label: 'Figma design', icon: <FaFigma className='w-4 h-4' /> },
    { key: 'google_drive_link' as const, label: 'Google Drive', icon: <FaGoogleDrive className='w-4 h-4' /> },
    { key: 'postman_link' as const, label: 'Postman collection', icon: <Code2 className='w-4 h-4' /> },
]

export function ProjectCard({ project }: { project: ProjectInterface }) {
    return (
        <Card key={project.id} className='px-0 py-0 h-full w-full' backgroundColor='bg-background'>
            <Link href={`/projects/${project.slug}`} className='block'>
                <div className='p-2 rounded-lg'>
                    <div className='w-full h-full flex items-center justify-center p-2 bg-accent/70'>
                        <ImageComponent
                            src={
                                (project.files && project.files.length > 0)
                                    ? (project.files.find(file => file.position === 1)?.url ?? "")
                                    : "/images/placeholder.png"
                            }
                            alt={project.name}
                            width={500}
                            height={250}
                            objectFit='contain'
                            className='rounded-sm'
                        />
                    </div>
                </div>
            </Link>
            <div className='flex flex-col gap-2 p-4 mt-4'>
                <div className="flex items-center justify-between mb-4">
                    <Badge variant='secondary'>{project.sector}</Badge>
                    <Badge variant='outlineSecondary'>{project.role}</Badge>
                </div>
                <Link href={`/projects/${project.slug}`}>
                    <h3 className='text-xl font-bold hover:text-primary-strong transition-colors duration-(--dur-fast)'>{project.name}</h3>
                </Link>
                <p className='text-base text-primary-strong'>{project.tagline ?? "No tagline"}</p>
                <MarkdownRenderer
                    content={project.description ?? 'No description'}
                    className='text-base text-foreground/60 line-clamp-2 break-words [&_p]:mb-0'
                />

                <div className="flex flex-wrap gap-2 mt-2">
                    {Array.isArray(project.tools) && project.tools.slice(0, 4).map((tool, idx) => (
                        <Badge key={tool + idx} variant="outlineSecondary">{tool}</Badge>
                    ))}
                    {Array.isArray(project.tools) && project.tools.length > 4 && (
                        <Badge variant="outlineSecondary">
                            {project.tools.length - 4} more
                        </Badge>
                    )}
                </div>
                <div className='flex flex-col gap-2 mt-2'>
                    <LinkButton
                        variant='primary'
                        size='sm'
                        className='w-full'
                        to={`/projects/${project.slug}`}
                    >
                        <Eye className='w-4 h-4 mr-2' />
                        <span>View Project</span>
                    </LinkButton>

                    <div className='flex flex-wrap gap-2'>
                        {externalLinks.map(({ key, label, icon }) => {
                            const url = project[key]
                            if (!url) return null
                            return (
                                <a
                                    key={key}
                                    href={url}
                                    target='_blank'
                                    rel='noreferrer noopener'
                                    aria-label={label}
                                    title={label}
                                    className='h-9 w-9 inline-flex items-center justify-center rounded-md border border-border text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors duration-(--dur-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
                                >
                                    {icon}
                                </a>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Card>
    )
}
