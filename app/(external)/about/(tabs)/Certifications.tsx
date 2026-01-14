import Loading from '@/app/loading'
import Button from '@/components/shared/button/Button'
import Card from '@/components/shared/card/Card'
import ImageComponent from '@/components/shared/Image'
import ListEmpty from '@/components/shared/ListEmpty'
import Pagination from '@/components/shared/Pagination'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { getCertifications } from '@/lib/redux/slices/certification/certification'
import { GetCertificationsParams } from '@/lib/redux/slices/certification/certification.service'
import { formatDate } from '@/lib/utils/formatter'
import { Calendar, ExternalLink } from 'lucide-react'
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
        {certifications?.length === 0 && (
            <ListEmpty title='certification' />
        )}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {certifications?.map((certification) => (
                <Card key={certification.id}>
                    <div className='flex items-start gap-4 mb-2'>
                        <ImageComponent 
                            src={certification.issuer_image?.url ?? ""} 
                            alt={certification.name} 
                            width={40} 
                            height={40}
                            className='rounded-lg'
                            objectFit='contain'
                        />
                        <div className='w-full'>
                            <h3 className='text-xl max-md:text-lg font-bold'>{certification.name}</h3>
                            <div className="">
                                <p className='text-primary text-sm'>{certification.issuer}</p>
                                <div className='flex items-center gap-2 max-md:items-start'>
                                    <Calendar className='w-4 h-4' />
                                    <p className='text-sm text-foreground/60'>{formatDate(certification.issue_date ?? "")}</p>
                                </div>
                            </div>
                        </div>
                    </div> 
                    {certification.credential_id && (
                        <p className='text-sm text-foreground/60 mb-2'><span className='font-bold'>Credential ID:</span> {certification.credential_id}</p>         
                    )}
                    {certification.credential_url && (
                        <Button
                            variant='primary'
                            size='sm'
                            className='w-full'
                            onClick={() => window.open(certification.credential_url, '_blank')}
                        >
                            <ExternalLink className='w-4 h-4 mr-2' />
                            Verify Credential
                        </Button>
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
