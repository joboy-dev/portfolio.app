import Loading from '@/app/loading'
import Card from '@/components/shared/card/Card'
import ImageComponent from '@/components/shared/Image'
import ListEmpty from '@/components/shared/ListEmpty'
import Pagination from '@/components/shared/Pagination'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { getAwards } from '@/lib/redux/slices/award/award'
import { GetAwardsParams } from '@/lib/redux/slices/award/award.service'
import { formatDate } from '@/lib/utils/formatter'
import React, { useEffect, useState } from 'react' 

export default function Awards() {
  const { awards, isLoading, totalPages, currentPage } = useAppSelector(state => state.award)
  const dispatch = useAppDispatch()
  const [ filterState, setFilterState ] = useState<GetAwardsParams>({
    page: 1,
    per_page: 10,
  })

  useEffect(() => {
    dispatch(getAwards({...filterState}))
  }, [dispatch, filterState])

  return isLoading ? <Loading/> : (
    <div className='flex flex-col gap-4'>
        {awards?.length === 0 && (
            <ListEmpty title='award' />
        )}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {awards?.map((award) => (
                <Card key={award.id} className='px-4 py-2'>
                    <div className='flex items-start gap-4'>
                        <ImageComponent 
                            src={award.issuer_image?.url ?? ""} 
                            alt={award.name} 
                            width={40} 
                            height={40}
                            className='rounded-lg'
                            objectFit='contain'
                        />
                        <div className='w-full'>
                            <h3 className='text-lg max-md:text-base font-bold'>{award.name}</h3>
                            <p className='text-sm text-foreground/60'>{award.issuer} • {formatDate(award.issue_date ?? "")}</p>
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
