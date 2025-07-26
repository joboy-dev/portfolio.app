import Loading from '@/app/loading'
import Card from '@/components/shared/card/Card'
import ImageComponent from '@/components/shared/Image'
import ListEmpty from '@/components/shared/ListEmpty'
import Pagination from '@/components/shared/Pagination'
import ProgressBar from '@/components/shared/ProgressBar'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { getSkills } from '@/lib/redux/slices/skill/skill'
import { GetSkillsParams } from '@/lib/redux/slices/skill/skill.service'
import React, { useEffect, useState } from 'react'

export default function Skills() {
  const { skills, isLoading, totalPages, currentPage } = useAppSelector(state => state.skill)
  const dispatch = useAppDispatch()
  const [ filterState, setFilterState ] = useState<GetSkillsParams>({
    page: 1,
    per_page: 50,
  })

  useEffect(() => {
    if (!skills) {
        dispatch(getSkills({...filterState}))
    }
  }, [dispatch, filterState])

  return isLoading ? <Loading/> : (
    <div className='flex flex-col gap-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {skills?.length === 0 && (
              <ListEmpty title='skills' />
            )}

            {skills?.map((skill) => (
              <Card key={skill.id}>
                  <div className='flex items-center gap-4 mb-2'>
                      <ImageComponent 
                          src={skill.skill_logo?.url ?? ""} 
                          alt={skill.name} 
                          width={40} 
                          height={40}
                          className='rounded-lg'
                          objectFit='cover'
                      />
                      <div className='w-full'>
                          <h3 className='text-lg font-bold'>{skill.name}</h3>
                          <p className='text-sm text-foreground/60'>{skill.proficiency}% Proficiency</p>
                      </div>
                  </div>            
                  <ProgressBar value={skill.proficiency ?? 0} max={100} width='full'/>
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
