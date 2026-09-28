import Card from '@/components/shared/card/Card'
import ListEmpty from '@/components/shared/ListEmpty'
import Pagination from '@/components/shared/Pagination'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { getTestimonials } from '@/lib/redux/slices/testimonial/testimonial'
import { GetTestimonialsParams } from '@/lib/redux/slices/testimonial/testimonial.service'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { FaQuoteRight } from 'react-icons/fa6'
import { SkeletonCard } from '@/components/shared/Skeleton'

export default function Testimonials() {
  const { testimonials, isLoading, totalPages, currentPage } = useAppSelector(state => state.testimonial)
  const dispatch = useAppDispatch()
  const [ filterState, setFilterState ] = useState<GetTestimonialsParams>({
    page: 1,
    per_page: 10,
    is_published: true,
  })

  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    dispatch(getTestimonials({...filterState}))
  }, [dispatch, filterState])

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} className='rounded-lg border border-border' />)}
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
        {testimonials?.length === 0 && (
            <ListEmpty title='testimonial' />
        )}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {testimonials?.map((testimonial) => (
                <Card key={testimonial.id}>
                    <div className='w-full flex flex-col gap-1'>
                        <div className='mb-1'>
                            {testimonial.rating && (
                                <div className="flex items-center">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <span key={i} className="text-warning text-xl">&#9733;</span>
                                    ))}
                                    {Array.from({ length: 5 - testimonial.rating }).map((_, i) => (
                                        <span key={i} className="text-muted-foreground/30 text-xl">&#9733;</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className='relative'>
                            <div className='absolute -left-4 -top-5 '>
                                <FaQuoteRight className='text-primary/10 text-4xl'/>
                            </div>
                            <div className='pl-4'>
                                <p className={clsx('text-sm text-muted-foreground', !expanded[testimonial.id] && 'line-clamp-3')}>
                                    {testimonial.message}
                                </p>
                                {(testimonial.message?.length ?? 0) > 140 && (
                                    <button
                                        type='button'
                                        onClick={() => setExpanded(prev => ({ ...prev, [testimonial.id]: !prev[testimonial.id] }))}
                                        className='text-sm font-medium text-primary-strong hover:underline mt-1'
                                    >
                                        {expanded[testimonial.id] ? 'Show less' : 'Read more'}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className='pt-2 border-t border-border'>
                            <p className='text-base font-semibold'>{testimonial.name}</p>
                            {testimonial.title && (
                                <p className='text-sm text-muted-foreground'>{testimonial.title}</p>
                            )}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
        
        <Pagination
            currentPage={currentPage ?? 1}
            totalPages={totalPages ?? 1}
            onPageChange={(page) => setFilterState(prev => ({...prev, page}))}
        />
    </div>
  )
}
