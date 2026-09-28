import Badge from '@/components/shared/Badge'
import Card from '@/components/shared/card/Card'
import ImageComponent from '@/components/shared/Image'
import ListEmpty from '@/components/shared/ListEmpty'
import Pagination from '@/components/shared/Pagination'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { getEducations } from '@/lib/redux/slices/education/education'
import { GetEducationsParams } from '@/lib/redux/slices/education/education.service'
import { formatDate } from '@/lib/utils/formatter'
import MarkdownRenderer from '@/components/shared/MarkdownRenderer'
import { Building, MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { Timeline, TimelineItem } from '@/components/shared/Timeline'
import { SkeletonTimelineItem } from '@/components/shared/Skeleton'

export default function Education() {
  const { educations, isLoading, totalPages, currentPage } = useAppSelector(state => state.education)
  const dispatch = useAppDispatch()
  const [ filterState, setFilterState ] = useState<GetEducationsParams>({
    page: 1,
    per_page: 10,
    is_published: true,
  })

  // Manage open description by education id
  const [openDesc, setOpenDesc] = useState<Record<string | number, boolean>>({})

  useEffect(() => {
    dispatch(getEducations({...filterState}))
  }, [dispatch, filterState])

  const handleToggleDesc = (id: string | number) => {
    setOpenDesc(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (isLoading) {
    return (
      <div className='flex flex-col'>
        {Array.from({ length: 3 }).map((_, i) => <SkeletonTimelineItem key={i} isLast={i === 2} />)}
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
        {educations?.length === 0 && (
            <ListEmpty title='education' />
        )}
        <Timeline>
            {educations?.map((education, index) => {
              const isOpen = openDesc[education.id] || false
              return (
                <TimelineItem key={education.id} isLast={index === educations.length - 1}>
                <Card className='flex flex-col gap-2 items-start justify-start p-8 max-sm:p-5'>
                    <div className='flex items-start gap-4 mb-2'>
                        <ImageComponent
                            src={education.school_logo?.url ?? ""}
                            alt={education.school}
                            width={60}
                            height={60}
                            className='rounded-lg'
                            objectFit='contain'
                        />
                        <div className='w-full'>
                            <h3 className='text-2xl font-semibold'>{education.degree}</h3>
                            <div className="flex flex-col items-start justify-start">
                                <div className='flex items-center gap-2 text-sm text-primary max-md:items-start'>
                                    <Building className='w-4 h-4' />
                                    <p>{education.school}</p>
                                </div>
                                <p className='text-sm text-muted-foreground'>{formatDate(education.start_date)} - {education.end_date ? formatDate(education.end_date) : 'Present'}</p>
                            </div>
                            {education.location && (
                                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                                    <MapPin className='w-4 h-4' />
                                    <p>{education.location}</p>
                                </div>
                            )}
                            {education.grade && (
                                <Badge variant='outline'>{education.grade}</Badge>
                            )}
                        </div>
                    </div>
                    {education.description && (
                      <div className="w-full">
                        <button
                          className={`flex items-center gap-2 text-sm font-medium px-2 py-1 rounded transition-colors hover:bg-muted text-primary border border-transparent mb-1`}
                          onClick={() => handleToggleDesc(education.id)}
                          aria-expanded={isOpen}
                          aria-controls={`desc-${education.id}`}
                        >
                          {isOpen ? (
                            <>
                              Hide Details <ChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              Show Details <ChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </button>
                        <div
                          id={`desc-${education.id}`}
                          className={clsx(
                            'grid transition-[grid-template-rows] duration-(--dur-base) ease-out',
                            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                          )}
                        >
                          <div className='overflow-hidden'>
                            <MarkdownRenderer content={education.description} className='text-lg text-foreground/60' />
                          </div>
                        </div>
                      </div>
                    )}
                </Card>
                </TimelineItem>
              )
            })}
        </Timeline>
        
        <Pagination
            currentPage={currentPage ?? 1}
            totalPages={totalPages ?? 1}
            onPageChange={(page) => setFilterState(prev => ({...prev, page}))}
        />
    </div>
  )
}
