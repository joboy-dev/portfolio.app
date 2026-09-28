import ImageComponent from '@/components/shared/Image'
import ListEmpty from '@/components/shared/ListEmpty'
import Pagination from '@/components/shared/Pagination'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { getSkills } from '@/lib/redux/slices/skill/skill'
import { GetSkillsParams } from '@/lib/redux/slices/skill/skill.service'
import { getSkillLevel } from '@/lib/utils/formatter'
import React, { useEffect, useState } from 'react'
import { SkeletonCard } from '@/components/shared/Skeleton'

export default function Skills() {
  const { skills, isLoading, totalPages, currentPage } = useAppSelector(state => state.skill)
  const dispatch = useAppDispatch()
  const [ filterState, setFilterState ] = useState<GetSkillsParams>({
    page: 1,
    per_page: 50,
    is_published: true,
  })

  useEffect(() => {
    dispatch(getSkills({...filterState}))
  }, [dispatch, filterState])

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} className='rounded-lg border border-border' />)}
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
        {skills?.length === 0 && (
          <ListEmpty title='skills' />
        )}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {skills?.map((skill) => (
              <div key={skill.id} className='flex flex-col items-center justify-center gap-3 p-5 rounded-lg border border-border bg-secondary/40 text-center'>
                  <ImageComponent
                      src={skill.skill_logo?.url ?? ""}
                      alt={skill.name}
                      width={40}
                      height={40}
                      objectFit='contain'
                  />
                  <div>
                    <p className='text-sm font-semibold text-foreground'>{skill.name}</p>
                    <p className='text-xs text-muted-foreground mt-0.5'>{getSkillLevel(skill.proficiency)}</p>
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
