'use client'

import React from 'react'
import Card from '../shared/card/Card'
import { BlogInterface } from '@/lib/interfaces/blog'
import ImageComponent from '../shared/Image'
import Badge from '../shared/Badge'
import LinkButton from '../shared/button/LinkButton'
import { formatDate } from '@/lib/utils/formatter'
import { CalendarIcon, Eye, Tag } from 'lucide-react'

export function BlogCard({ blog }: { blog: BlogInterface }) {
    return (
        <Card key={blog.id} className='px-0 py-0 h-full w-full' backgroundColor='bg-background'>
            <div className='p-2 rounded-lg'>
                <div className='w-full h-full flex items-center justify-center p-2 bg-accent/70'>
                    <ImageComponent
                        src={blog.cover_image_url ?? '/images/placeholder.png'}
                        alt={blog.title}
                        width={500}
                        height={250}
                        objectFit='contain'
                        className='rounded-sm'
                    />
                </div>
            </div>
            <div className='flex flex-col gap-2 p-4 mt-4'>
                {blog.published_at && (
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <CalendarIcon className='w-4 h-4' />
                        {formatDate(blog.published_at)}
                    </div>
                )}
                <h3 className='text-xl font-bold'>{blog.title}</h3>
                <p className='text-base text-foreground/60 line-clamp-3 break-words'>
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

                <LinkButton
                    variant='primary'
                    size='sm'
                    className='w-full mt-2'
                    to={`/blog/${blog.slug}`}
                >
                    <Eye className='w-4 h-4 mr-2' />
                    <span>Read Post</span>
                </LinkButton>
            </div>
        </Card>
    )
}
