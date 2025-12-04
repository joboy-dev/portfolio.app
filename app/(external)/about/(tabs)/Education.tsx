import Loading from '@/app/loading'
import Badge from '@/components/shared/Badge'
import Card from '@/components/shared/card/Card'
import ImageComponent from '@/components/shared/Image'
import ListEmpty from '@/components/shared/ListEmpty'
import Pagination from '@/components/shared/Pagination'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { getEducations } from '@/lib/redux/slices/education/education'
import { GetEducationsParams } from '@/lib/redux/slices/education/education.service'
import { formatDate } from '@/lib/utils/formatter'
import { renderWithLineBreaks } from '@/lib/utils/string'
import { Building, MapPin } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export default function Education() {
  const { educations, isLoading, totalPages, currentPage } = useAppSelector(state => state.education)
  const dispatch = useAppDispatch()
  const [ filterState, setFilterState ] = useState<GetEducationsParams>({
    page: 1,
    per_page: 10,
  })

  useEffect(() => {
    dispatch(getEducations({...filterState}))
  }, [dispatch, filterState])

  return isLoading ? <Loading/> : (
    <div className='flex flex-col gap-4'>
        <div className='grid grid-cols-1 gap-4'>
            {educations?.length === 0 && (
                <ListEmpty title='education' />
            )}

            {educations?.map((education) => (
                <Card key={education.id} className='flex flex-col gap-2 items-start justify-start'>
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
                            <h3 className='text-2xl max-md:text-xl font-bold'>{education.degree}</h3>
                            <div className="flex items-center justify-between max-md:flex-col max-md:items-start max-md:justify-start max-md:gap-0">
                                <div className='flex items-center gap-2 text-sm text-primary max-md:items-start'>
                                    <Building className='w-4 h-4' />
                                    <p>{education.school}</p>
                                </div>
                                <p className='text-sm text-foreground/60'>{formatDate(education.start_date)} - {education.end_date ? formatDate(education.end_date) : 'Present'}</p>
                            </div>
                            {education.location && (
                                <div className='flex items-center gap-2 text-sm text-foreground/60'>
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
                        <p className='text-lg text-foreground/60 mt-2'>{renderWithLineBreaks(education.description)}</p>
                    )}
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
