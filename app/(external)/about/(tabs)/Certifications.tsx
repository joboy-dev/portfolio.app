import Loading from '@/app/loading'
import Card from '@/components/shared/card/Card'
import ImageComponent from '@/components/shared/Image'
import ListEmpty from '@/components/shared/ListEmpty'
import Pagination from '@/components/shared/Pagination'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { getCertifications } from '@/lib/redux/slices/certification/certification'
import { GetCertificationsParams } from '@/lib/redux/slices/certification/certification.service'
import { formatDate } from '@/lib/utils/formatter'
import { renderWithLineBreaks } from '@/lib/utils/string'
import { Building } from 'lucide-react'
import React, { useEffect, useState } from 'react' 

export default function Certifications() {
  const { certifications, isLoading, totalPages, currentPage } = useAppSelector(state => state.certification)
  const dispatch = useAppDispatch()
  const [ filterState, setFilterState ] = useState<GetCertificationsParams>({
    page: 1,
    per_page: 10,
  })

  useEffect(() => {
    dispatch(getCertifications({...filterState}))
  }, [dispatch, filterState])

  return isLoading ? <Loading/> : (
    <div className='flex flex-col gap-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {certifications?.length === 0 && (
                <ListEmpty title='certification' />
            )}

            {certifications?.map((certification) => (
                <Card key={certification.id}>
                    <div className='flex items-start gap-4 mb-2'>
                        <ImageComponent 
                            src={certification.issuer_image?.url ?? ""} 
                            alt={certification.name} 
                            width={60} 
                            height={60}
                            className='rounded-lg'
                            objectFit='contain'
                        />
                        <div className='w-full'>
                            <h3 className='text-2xl max-md:text-xl font-bold'>{certification.name}</h3>
                            <div className="flex items-center justify-between max-md:flex-col max-md:items-start max-md:justify-start max-md:gap-0">
                                <div className='flex items-center gap-2 text-sm text-primary max-md:items-start'>
                                    <Building className='w-4 h-4' />
                                    <p>{certification.issuer}</p>
                                </div>
                                <p className='text-sm text-foreground/60'>{formatDate(certification.issue_date ?? "")}</p>
                            </div>
                        </div>
                    </div>            
                </Card>
            ))}
        </div>
        
        <Pagination
            currentPage={currentPage ?? 1}
            totalPages={totalPages ?? 1}
            onPageChange={(page) => setFilterState({...filterState, page})}
        />
    </div>
  )
}
