import Loading from '@/app/loading'
import Card from '@/components/shared/card/Card'
import ImageComponent from '@/components/shared/Image'
import ListEmpty from '@/components/shared/ListEmpty'
import Pagination from '@/components/shared/Pagination'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { getExperiences } from '@/lib/redux/slices/experience/experience'
import { GetExperiencesParams } from '@/lib/redux/slices/experience/experience.service'
import { formatDate } from '@/lib/utils/formatter'
import MarkdownRenderer from '@/components/shared/MarkdownRenderer'
import { Building, MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Timeline, TimelineItem } from '@/components/shared/Timeline'

export default function Experience() {
  const { experiences, isLoading, totalPages, currentPage } = useAppSelector(state => state.experience)
  const dispatch = useAppDispatch()
  const [filterState, setFilterState] = useState<GetExperiencesParams>({
    page: 1,
    per_page: 10,
  })

  // Manage open description by experience id
  const [openDesc, setOpenDesc] = useState<Record<string | number, boolean>>({})

  useEffect(() => {
    dispatch(getExperiences({ ...filterState }))
  }, [dispatch, filterState])

  const handleToggleDesc = (id: string | number) => {
    setOpenDesc(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return isLoading ? <Loading /> : (
    <div className='flex flex-col gap-4'>
      {experiences?.length === 0 && (
        <ListEmpty title='experience' />
      )}
      <Timeline>
        {experiences?.map((experience, index) => {
          const isOpen = openDesc[experience.id] || false
          return (
            <TimelineItem key={experience.id} isLast={index === experiences.length - 1}>
              <Card className='flex flex-col gap-2 items-start justify-start p-8 max-sm:p-5'>
                <div className='flex items-start gap-4 mb-2'>
                  <ImageComponent
                    src={experience.company_logo?.url ?? ""}
                    alt={experience.company}
                    width={60}
                    height={60}
                    className='rounded-lg'
                    objectFit='contain'
                  />
                  <div className='w-full'>
                    <h3 className='text-2xl font-semibold'>{experience.role}</h3>
                    <div className="flex flex-col items-start justify-start">
                      <div className='flex items-center gap-2 text-sm text-primary max-md:items-start'>
                        <Building className='w-4 h-4' />
                        <p>{experience.company}</p>
                      </div>
                      <p className='text-sm text-muted-foreground'>{formatDate(experience.start_date)} - {experience.end_date ? formatDate(experience.end_date) : 'Present'}</p>
                    </div>
                    {experience.location && (
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <MapPin className='w-4 h-4' />
                        <p>{experience.location}</p>
                      </div>
                    )}
                  </div>
                </div>
                {experience.description && (
                  <div className="w-full">
                    <button
                      className={`flex items-center gap-2 text-sm font-medium px-2 py-1 rounded transition-colors hover:bg-muted text-primary border border-transparent mb-1`}
                      onClick={() => handleToggleDesc(experience.id)}
                      aria-expanded={isOpen}
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
                    {isOpen && (
                      <div className="animate-fade-in mt-2">
                        <MarkdownRenderer content={experience.description} className='text-lg text-foreground/60' />
                      </div>
                    )}
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
        onPageChange={(page) => setFilterState(prev => ({ ...prev, page }))}
      />
    </div>
  )
}
