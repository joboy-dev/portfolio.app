'use client'

import Loading from '@/app/loading'
import ContactForm from '@/components/messages/ContactForm'
import { BlogCard } from '@/components/blog/Card'
import Button from '@/components/shared/button/Button'
import { SearchField } from '@/components/shared/form/SearchField'
import { useAppDispatch } from '@/lib/hooks/redux'
import { getBlogs } from '@/lib/redux/slices/blog/blog'
import { GetBlogsParams } from '@/lib/redux/slices/blog/blog.service'
import { BlogInterface } from '@/lib/interfaces/blog'
import { User2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ListEmpty from '@/components/shared/ListEmpty'
import Reveal from '@/components/shared/motion/Reveal'
import Eyebrow from '@/components/shared/motion/Eyebrow'
import CTASection from '@/components/shared/CTASection'

const PER_PAGE = 9

export default function BlogsPage() {
    const dispatch = useAppDispatch()
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [posts, setPosts] = useState<BlogInterface[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [filterState, setFilterState] = useState<GetBlogsParams>({
        per_page: PER_PAGE,
    })

    const loadPage = async (targetPage: number, replace: boolean) => {
        if (replace) setIsLoading(true)
        else setIsLoadingMore(true)

        const response = await dispatch(getBlogs({
            ...filterState,
            is_published: true,
            page: targetPage,
        })).unwrap()

        setPosts((prev) => replace ? (response?.data ?? []) : [...prev, ...(response?.data ?? [])])
        setTotalPages(response?.pagination_data?.pages ?? 1)
        setPage(targetPage)

        setIsLoading(false)
        setIsLoadingMore(false)
    }

    useEffect(() => {
        loadPage(1, true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterState])

    return (
        <div>
            <ContactForm
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Let's Work Together"
                subtitle='Send me a message and let us discuss your next project.'
            />

            <section className='relative overflow-hidden page-padding min-h-[80vh] flex flex-col items-center justify-center bg-secondary/50'>
                <div className="hero-texture absolute inset-0 pointer-events-none" aria-hidden="true" />
                <Reveal className="relative flex flex-col items-center">
                    <Eyebrow>writing</Eyebrow>
                    <h1 className="text-5xl lg:text-7xl font-semibold mb-6 leading-tight tracking-tight text-center" >
                        <span className="text-foreground">My</span>
                        <br />
                        <span className="bg-gradient-primary bg-clip-text text-transparent">Blog</span>
                    </h1>
                    <p className='text-xl text-foreground/60 font-normal leading-relaxed text-center max-md:text-base max-w-3xl'>
                    Articles, tutorials, and notes on software engineering, frontend and backend development, and the occasional behind-the-scenes look at how I build things.
                    </p>
                </Reveal>
            </section>

            <section className='nav-padding min-h-[10vh] flex items-start justify-between gap-8 bg-background max-sm:flex-col max-sm:gap-4 max-sm:items-start'>
                <SearchField
                    placeholder='Search blog posts'
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSearch={() => setFilterState({...filterState, search: searchQuery})}
                    onSearchClear={() => setFilterState({...filterState, search: ''})}
                />
            </section>

            {isLoading ? (
                <Loading />
            ) : (
                <section className='page-padding bg-secondary/50'>
                    {posts.length === 0 && <ListEmpty title='blog posts'/>}

                    {posts.length > 0 && (
                        <>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {posts.map((post, index) => (
                                    <Reveal key={post.id} delay={Math.min((index % PER_PAGE) * 0.08, 0.4)}>
                                        <BlogCard blog={post} />
                                    </Reveal>
                                ))}
                            </div>

                            {page < totalPages && (
                                <div className='flex justify-center mt-10'>
                                    <Button
                                        variant='outline'
                                        isLoading={isLoadingMore}
                                        onClick={() => loadPage(page + 1, false)}
                                    >
                                        Load More
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            )}

            <CTASection
                heading="Enjoyed What You Read?"
                subtitle="I am always excited to take on new challenges and create innovative solutions. Let us discuss your next project."
                primaryAction={{ label: "Learn More About Me", icon: <User2 className="ml-2 h-5 w-5 inline" />, to: "/about" }}
                secondaryAction={{ label: "Get In Touch", onClick: () => setIsOpen(true) }}
            />
        </div>
    )
}
