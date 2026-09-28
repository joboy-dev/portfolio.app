'use client'

import React from 'react'
import Card from '../shared/card/Card'
import { BlogInterface } from '@/lib/interfaces/blog'
import ImageComponent from '../shared/Image'
import Badge from '../shared/Badge'
import { formatDate, getReadTime } from '@/lib/utils/formatter'
import { CalendarIcon, Clock, Tag } from 'lucide-react'

export function BlogCard({ blog, featured = false }: { blog: BlogInterface, featured?: boolean }) {
    return (
        <Card
            key={blog.id}
            linkTo={`/blog/${blog.slug}`}
            className={`px-0 py-0 h-full w-full ${featured ? 'md:grid md:grid-cols-2 md:items-stretch' : ''}`}
            backgroundColor='bg-background'
        >
            <div className={featured ? 'h-full' : 'p-2 rounded-lg'}>
                <div className={`w-full h-full flex items-center justify-center bg-accent/70 ${featured ? '' : 'p-2'}`}>
                    <ImageComponent
                        src={blog.cover_image_url ?? '/images/placeholder.png'}
                        alt={blog.title}
                        width={500}
                        height={featured ? 350 : 250}
                        objectFit={featured ? 'cover' : 'contain'}
                        className={featured ? 'h-full' : 'rounded-sm'}
                    />
                </div>
            </div>
            <div className={`flex flex-col gap-2 p-4 ${featured ? 'md:p-8 md:justify-center' : 'mt-4'}`}>
                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    {blog.published_at && (
                        <span className='flex items-center gap-1.5'>
                            <CalendarIcon className='w-4 h-4' />
                            {formatDate(blog.published_at)}
                        </span>
                    )}
                    <span className='flex items-center gap-1.5'>
                        <Clock className='w-4 h-4' />
                        {getReadTime(blog.content)}
                    </span>
                </div>

                <h3 className={`font-bold group-hover:text-primary-strong transition-colors duration-(--dur-fast) ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                    {blog.title}
                </h3>

                <p className={`text-base text-foreground/60 break-words ${featured ? 'line-clamp-3' : 'line-clamp-3'}`}>
                    {blog.excerpt ?? 'No excerpt'}
                </p>

                {blog.tags && blog.tags.length > 0 && (
                    <div className='flex flex-wrap gap-2 mt-2'>
                        {blog.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag.id} variant='outlineSecondary'>
                                <Tag className='w-3 h-3 mr-1' />
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    )
}
