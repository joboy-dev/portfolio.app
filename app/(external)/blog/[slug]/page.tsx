'use client'

import Loading from '@/app/loading'
import { BlogCard } from '@/components/blog/Card'
import Badge from '@/components/shared/Badge'
import ImageComponent from '@/components/shared/Image'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { BlogInterface } from '@/lib/interfaces/blog'
import { getBlogById, getBlogs } from '@/lib/redux/slices/blog/blog'
import { formatDate } from '@/lib/utils/formatter'
import MarkdownRenderer from '@/components/shared/MarkdownRenderer'
import { CalendarIcon, Tag } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Eyebrow from '@/components/shared/motion/Eyebrow'
import Reveal from '@/components/shared/motion/Reveal'

export default function BlogDetailPage() {
    const { slug } = useParams()
    const dispatch = useAppDispatch()
    const { isLoading, selectedBlog: post } = useAppSelector(state => state.blog)
    const [relatedPosts, setRelatedPosts] = useState<BlogInterface[]>([])

    useEffect(() => {
        dispatch(getBlogById({ id: slug as string }))
    }, [dispatch, slug])

    useEffect(() => {
        if (post && post.tags && post.tags.length > 0) {
            dispatch(getBlogs({
                page: 1,
                per_page: 4,
                is_published: true,
                tags: post.tags.map((tag) => tag.name).join(','),
            })).unwrap().then((response) => {
                setRelatedPosts((response?.data ?? []).filter((p) => p.id !== post.id).slice(0, 3))
            })
        } else {
            setRelatedPosts([])
        }
    }, [dispatch, post])

    return isLoading ? <Loading /> : (
        <div>
            <section className='page-padding min-h-screen flex items-center justify-center max-md:flex-col-reverse max-md:items-start max-md:justify-start gap-10 bg-secondary/60'>
                <div className='flex flex-col gap-4 w-full'>
                    {post?.tags && post.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                            {post.tags.map((tag) => (
                                <Badge key={tag.id} variant='outlineSecondary'>
                                    <Tag className='w-3 h-3 mr-1' />
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                    )}
                    <Eyebrow>article</Eyebrow>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">{post?.title}</h1>
                    {post?.published_at && (
                        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <CalendarIcon className='w-4 h-4' />
                            {formatDate(post.published_at)}
                        </div>
                    )}
                    {post?.excerpt && (
                        <p className='text-lg max-md:text-base text-primary'>{post.excerpt}</p>
                    )}
                </div>
                <div className='w-full h-full flex items-center justify-center'>
                    <ImageComponent
                        src={post?.cover_image_url ?? '/images/placeholder.png'}
                        alt={post?.title ?? ''}
                        objectFit='contain'
                        className='rounded-lg max-sm:w-full max-sm:h-full'
                        width={450}
                        height={300}
                    />
                </div>
            </section>

            <section className='page-padding min-h-screen bg-background'>
                <MarkdownRenderer content={post?.content ?? ''} className='prose max-w-none' />
            </section>

            {relatedPosts.length > 0 && (
                <section className='page-padding min-h-screen'>
                    <Reveal className='flex flex-col gap-4'>
                        <Eyebrow>related</Eyebrow>
                        <h2 className='text-4xl font-semibold tracking-tight'>Related Posts</h2>
                        <p className='text-sm text-muted-foreground'>
                            More posts related to {post?.title}
                        </p>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
                            {relatedPosts.map((relatedPost, index) => (
                                <Reveal key={relatedPost.id} delay={Math.min(index * 0.08, 0.4)}>
                                    <BlogCard blog={relatedPost} />
                                </Reveal>
                            ))}
                        </div>
                    </Reveal>
                </section>
            )}
        </div>
    )
}
