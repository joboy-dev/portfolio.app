import Card from '@/components/shared/card/Card'
import { useAppSelector } from '@/lib/hooks/redux'
import React from 'react'

export default function Overview() {
    const { selectedProject } = useAppSelector(state => state.project)
    return (
        <Card
            className='w-full'
            title='Technical Implementation'
            backgroundColor='bg-background'
        >
            {Object.entries(selectedProject?.technical_details ?? {}).map(([key, value]) => (
                <div key={key} className='flex flex-col items-start mb-2'>
                    <p className='text-lg text-primary font-bold'>{key}</p>
                    <p className='text-lg text-muted-foreground'>{value}</p>
                </div>
            ))}
        </Card>
    )
}
