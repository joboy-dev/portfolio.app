import ImageComponent from '@/components/shared/Image'
import ListEmpty from '@/components/shared/ListEmpty'
import Pagination from '@/components/shared/Pagination'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { getCertifications } from '@/lib/redux/slices/certification/certification'
import { GetCertificationsParams } from '@/lib/redux/slices/certification/certification.service'
import { formatDate } from '@/lib/utils/formatter'
import { ExternalLink } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { SkeletonListRow } from '@/components/shared/Skeleton'

export default function Certifications() {
  const { certifications, isLoading, totalPages, currentPage } = useAppSelector(state => state.certification)
  const dispatch = useAppDispatch()
  const [ filterState, setFilterState ] = useState<GetCertificationsParams>({
    page: 1,
    per_page: 10,
    is_published: true,
  })

  useEffect(() => {
    dispatch(getCertifications({...filterState}))
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
        {certifications?.length === 0 && (
            <ListEmpty title='certification' />
        )}
        <div className='divide-y divide-border'>
            {certifications?.map((certification) => (
                <div key={certification.id} className='flex items-center gap-4 py-4 first:pt-0 last:pb-0'>
                    <ImageComponent
                        src={certification.issuer_image?.url ?? ""}
                        alt={certification.name}
                        width={40}
                        height={40}
                        className='rounded-md shrink-0'
                        objectFit='contain'
                    />
                    <div className='min-w-0 flex-1'>
                        <h3 className='text-base font-semibold text-foreground truncate'>{certification.name}</h3>
                        <p className='text-sm text-muted-foreground truncate'>
                            <span className='text-primary'>{certification.issuer}</span>
                            {certification.issue_date && <> · {formatDate(certification.issue_date)}</>}
                            {certification.credential_id && <> · ID {certification.credential_id}</>}
                        </p>
                    </div>
                    {certification.credential_url && (
                        <a
                            href={certification.credential_url}
                            target='_blank'
                            rel='noreferrer noopener'
                            aria-label={`Verify ${certification.name} credential`}
                            title='Verify credential'
                            className='shrink-0 h-9 w-9 inline-flex items-center justify-center rounded-md border border-border text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors duration-(--dur-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
                        >
                            <ExternalLink className='w-4 h-4' />
                        </a>
                    )}
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
