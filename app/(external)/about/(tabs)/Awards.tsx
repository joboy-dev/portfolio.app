import ImageComponent from '@/components/shared/Image'
import ListEmpty from '@/components/shared/ListEmpty'
import Pagination from '@/components/shared/Pagination'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { getAwards } from '@/lib/redux/slices/award/award'
import { GetAwardsParams } from '@/lib/redux/slices/award/award.service'
import { formatDate } from '@/lib/utils/formatter'
import React, { useEffect, useState } from 'react'
import { SkeletonListRow } from '@/components/shared/Skeleton'

export default function Awards() {
  const { awards, isLoading, totalPages, currentPage } = useAppSelector(state => state.award)
  const dispatch = useAppDispatch()
  const [ filterState, setFilterState ] = useState<GetAwardsParams>({
    page: 1,
    per_page: 10,
    is_published: true,
  })

  useEffect(() => {
    dispatch(getAwards({...filterState}))
  }, [dispatch, filterState])

  if (isLoading) {
    return (
      <div className='flex flex-col'>
        {Array.from({ length: 5 }).map((_, i) => <SkeletonListRow key={i} />)}
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
        {awards?.length === 0 && (
            <ListEmpty title='award' />
        )}
        <div className='divide-y divide-border'>
            {awards?.map((award) => (
                <div key={award.id} className='flex items-center gap-4 py-4 first:pt-0 last:pb-0'>
                    <ImageComponent
                        src={award.issuer_image?.url ?? ""}
                        alt={award.name}
                        width={40}
                        height={40}
                        className='rounded-md shrink-0'
                        objectFit='contain'
                    />
                    <div className='min-w-0 flex-1'>
                        <h3 className='text-base font-semibold text-foreground truncate'>{award.name}</h3>
                        <p className='text-sm text-muted-foreground truncate'>
                            <span className='text-primary'>{award.issuer}</span>
                            {award.issue_date && <> · {formatDate(award.issue_date)}</>}
                        </p>
                    </div>
                </div>
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
