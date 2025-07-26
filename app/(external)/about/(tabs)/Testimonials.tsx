import Loading from '@/app/loading'
import Card from '@/components/shared/card/Card'
import ListEmpty from '@/components/shared/ListEmpty'
import Pagination from '@/components/shared/Pagination'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { getTestimonials } from '@/lib/redux/slices/testimonial/testimonial'
import { GetTestimonialsParams } from '@/lib/redux/slices/testimonial/testimonial.service'
import React, { useEffect, useState } from 'react' 
import { FaQuoteRight } from 'react-icons/fa6'

export default function Testimonials() {
  const { testimonials, isLoading, totalPages, currentPage } = useAppSelector(state => state.testimonial)
  const dispatch = useAppDispatch()
  const [ filterState, setFilterState ] = useState<GetTestimonialsParams>({
    page: 1,
    per_page: 10,
    is_published: true,
  })

  useEffect(() => {
    dispatch(getTestimonials({...filterState}))
  }, [dispatch, filterState])

  return isLoading ? <Loading/> : (
    <div className='flex flex-col gap-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {testimonials?.length === 0 && (
                <ListEmpty title='testimonial' />
            )}

            {testimonials?.map((testimonial) => (
                <Card key={testimonial.id} className='px-6 py-2'>
                    <div className='w-full flex flex-col gap-1'>
                        <div className='mb-1'>
                            {testimonial.rating && (
                                <div className="flex items-center">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-xl">&#9733;</span>
                                    ))}
                                    {Array.from({ length: 5 - testimonial.rating }).map((_, i) => (
                                        <span key={i} className="text-gray-300 text-xl">&#9733;</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className='relative'>
                            <div className='absolute -left-4 -top-5 '>
                                <FaQuoteRight className='text-primary/10 text-4xl'/>
                            </div>
                            <div className='pl-4'>
                                <p className='text-sm text-foreground/60'>{testimonial.message}</p>
                            </div>
                        </div>

                        <div className='pt-2 border-t border-foreground/10'>
                            <p className='text-sm font-bold'>{testimonial.name}</p>
                            {testimonial.title && (
                                <p className='text-sm text-foreground/60'>{testimonial.title}</p>
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
