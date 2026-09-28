'use client'

import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { ProjectInterface } from '@/lib/interfaces/project'
import ImageComponent from '../shared/Image'
import Badge from '../shared/Badge'
import { Code2 } from 'lucide-react'
import { FaFigma, FaGithub, FaGlobe, FaGoogleDrive } from 'react-icons/fa6'
import MarkdownRenderer from '../shared/MarkdownRenderer'

const externalLinks = [
    { key: 'live_link' as const, label: 'Live site', icon: <FaGlobe className='w-4 h-4' /> },
    { key: 'github_link' as const, label: 'GitHub repository', icon: <FaGithub className='w-4 h-4' /> },
    { key: 'figma_link' as const, label: 'Figma design', icon: <FaFigma className='w-4 h-4' /> },
    { key: 'google_drive_link' as const, label: 'Google Drive', icon: <FaGoogleDrive className='w-4 h-4' /> },
    { key: 'postman_link' as const, label: 'Postman collection', icon: <Code2 className='w-4 h-4' /> },
]

export function ProjectCard({ project }: { project: ProjectInterface }) {
    const links = externalLinks.filter(({ key }) => !!project[key])

    return (
        <div
            key={project.id}
            className={clsx(
                'group relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-border bg-background shadow-sm',
                'transition-[transform,box-shadow,border-color] duration-(--dur-base) ease-out',
                'hover-fine:-translate-y-0.5 hover-fine:shadow-md hover-fine:border-primary/30'
            )}
        >
            {/* Covers the whole card as one click/tap target (explicit z-10,
                above the static content's implicit stacking level, so hit-
                testing is unambiguous even before pointer-events-none is
                considered). The real, individually-clickable external links
                below sit at z-20 with pointer-events-auto so they still work
                — they are NOT descendants of this Link, so nothing here
                nests an <a> inside this <a> (invalid HTML, breaks targets). */}
            <Link
                href={`/projects/${project.slug}`}
                className='absolute inset-0 z-10 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
                aria-label={`View ${project.name}`}
                tabIndex={0}
            />

            <span
                className='absolute top-0 left-0 h-0.5 w-0 bg-primary transition-[width] duration-(--dur-base) ease-out group-hover:w-full z-0'
                aria-hidden='true'
            />

            <div className='p-2 rounded-lg pointer-events-none'>
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

            <div className='flex flex-1 flex-col gap-2 p-4 mt-4 pointer-events-none'>
                <div className="flex items-center justify-between mb-4">
                    <Badge variant='secondary'>{project.sector}</Badge>
                    <Badge variant='outlineSecondary'>{project.role}</Badge>
                </div>

                <h3 className='text-xl font-bold text-foreground transition-colors duration-(--dur-fast) group-hover:text-primary-strong'>
                    {project.name}
                </h3>
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

                {links.length > 0 && (
                    <div className='relative z-20 flex flex-wrap gap-2 mt-auto pt-4 pointer-events-auto'>
                        {links.map(({ key, label, icon }) => (
                            <a
                                key={key}
                                href={project[key]}
                                target='_blank'
                                rel='noreferrer noopener'
                                aria-label={label}
                                title={label}
                                className='h-9 w-9 inline-flex items-center justify-center rounded-md border border-border text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors duration-(--dur-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
                            >
                                {icon}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
