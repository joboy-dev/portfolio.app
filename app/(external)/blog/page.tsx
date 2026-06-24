'use client'

import Loading from '@/app/loading'
import ContactForm from '@/components/messages/ContactForm'
import { BlogCard } from '@/components/blog/Card'
import Button from '@/components/shared/button/Button'
import LinkButton from '@/components/shared/button/LinkButton'
import { SearchField } from '@/components/shared/form/SearchField'
import { useAppDispatch } from '@/lib/hooks/redux'
import { getBlogs } from '@/lib/redux/slices/blog/blog'
import { GetBlogsParams } from '@/lib/redux/slices/blog/blog.service'
import { BlogInterface } from '@/lib/interfaces/blog'
import { User2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ListEmpty from '@/components/shared/ListEmpty'

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

            <section className='page-padding min-h-[80vh] flex flex-col items-center justify-center bg-secondary/50'>
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight text-center" >
                    <span className="text-foreground">My</span>
                    <br />
                    <span className="bg-gradient-primary bg-clip-text text-transparent">Blog</span>
                </h1>
                <p className='text-xl text-foreground/60 font-normal leading-relaxed text-center max-md:text-base max-w-3xl'>
                Articles, tutorials, and notes on software engineering, frontend and backend development, and the occasional behind-the-scenes look at how I build things.
                </p>
            </section>

            <section className='py-8 px-[120px] max-md:px-8 min-h-[10vh] flex items-start justify-between gap-8 bg-background max-sm:flex-col max-sm:gap-4 max-sm:items-start'>
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
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                                {posts.map((post) => (
                                    <BlogCard key={post.id} blog={post} />
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

            <section className="page-padding bg-gradient-primary">
                <div className="max-w-4xl mx-auto text-center pb-12">
                    <h2 className="text-4xl font-bold text-primary-foreground mb-6 text-center">Enjoyed What You Read?</h2>
                    <p className="text-xl text-primary-foreground/80 mb-10 max-w-3xl max mx-auto leading-relaxed font-semibold text-center">
                    I am always excited to take on new challenges and create innovative solutions. Let us discuss your next project.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <LinkButton
                            to="/about"
                            size="lg"
                            variant="ghost"
                            className="bg-white text-lg font-bold text-primary"
                        >
                        <User2 className="mr-2 h-5 w-5" />
                            Learn More About Me
                        </LinkButton>

                        <LinkButton
                            to="#"
                            onClick={() => setIsOpen(true)}
                            variant="outline"
                            size="lg"
                            className="border-2 border-white text-white px-8 py-4 text-lg font-bold"
                        >
                            Get In Touch
                        </LinkButton>
                    </div>
                </div>
            </section>
        </div>
    )
}
