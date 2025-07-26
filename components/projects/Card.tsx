'use client'

import React from 'react'
import Card from '../shared/card/Card'
import { ProjectInterface } from '@/lib/interfaces/project'
import ImageComponent from '../shared/Image'
import Badge from '../shared/Badge'
import { renderWithLineBreaks } from '@/lib/utils/string'
import { Code2, Eye, User } from 'lucide-react'
import Button from '../shared/button/Button'
import { FaFigma, FaGithub, FaGlobe, FaGoogleDrive } from 'react-icons/fa6'
import LinkButton from '../shared/button/LinkButton'

export function ProjectCard({ project }: { project: ProjectInterface }) {
    return (
        <Card key={project.id} className='px-0 py-0 h-fit' backgroundColor='background'>
            <div className='w-full h-48 flex items-center justify-center'>
                <ImageComponent
                    src={
                        (project.files && project.files.length > 0)
                            ? (project.files.find(file => file.position === 1)?.url ?? "")
                            : "/images/placeholder.png"
                    }
                    alt={project.name}
                    className=''
                    width={100}
                    height={100}
                    objectFit='cover'
                />
            </div>
            <div className='flex flex-col gap-2 p-4 mt-4'>
                <div className="flex items-center justify-between mb-4">
                    <Badge variant='secondary'>{project.project_type}</Badge>
                    <Badge variant='outlineSecondary'>{project.role}</Badge>
                </div>
                <h3 className='text-xl font-bold'>{project.name}</h3>
                <p className='text-base text-primary'>{project.tagline ?? "No tagline"}</p>
                <p className='text-base text-foreground/60 line-clamp-2 break-words'>
                    {renderWithLineBreaks(project.description ?? 'No description')}
                </p>
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
                        {(project.live_link && project.live_link !== "") && (
                            <Button 
                                variant='outlineSecondary' 
                                size='sm'  
                                onClick={() => window.open(project.live_link, '_blank')}
                            >
                                <FaGlobe className='w-4 h-4' />
                            </Button>
                        )}
                        {(project.github_link && project.github_link !== "") && (
                            <Button 
                                variant='outlineSecondary' 
                                size='sm'  
                                onClick={() => window.open(project.github_link, '_blank')}
                            >
                                <FaGithub className='w-4 h-4' />
                            </Button>
                        )}
                        {(project.figma_link && project.figma_link !== "") && (
                            <Button 
                                variant='outlineSecondary' 
                                size='sm'  
                                onClick={() => window.open(project.figma_link, '_blank')}
                            >
                                <FaFigma className='w-4 h-4' />
                            </Button>
                        )}
                        {(project.google_drive_link && project.google_drive_link !== "") && (
                            <Button 
                                variant='outlineSecondary' 
                                size='sm'  
                                onClick={() => window.open(project.google_drive_link, '_blank')}
                            >
                                <FaGoogleDrive className='w-4 h-4' />
                            </Button>
                        )}
                        {(project.postman_link && project.postman_link !== "") && (
                            <Button 
                                variant='outlineSecondary' 
                                size='sm'  
                                onClick={() => window.open(project.postman_link, '_blank')}
                            >
                                <Code2  className='w-4 h-4' />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}
