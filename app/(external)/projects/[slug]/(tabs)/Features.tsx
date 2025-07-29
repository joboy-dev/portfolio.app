import Badge from '@/components/shared/Badge'
import Card from '@/components/shared/card/Card'
import { useAppSelector } from '@/lib/hooks/redux'
import { ChartBarIcon, CheckCircleIcon } from 'lucide-react'
import React from 'react'

export default function Overview() {
    const { selectedProject } = useAppSelector(state => state.project)
    return (
        <Card
            className='w-full'
            title='Project Features'
            backgroundColor='bg-background'
        >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                {selectedProject?.features?.map((feature) => (
                    <div className='flex items-center gap-2'>
                        <CheckCircleIcon className='w-5 h-5 text-primary' />
                        <p className='text-lg text-muted-foreground'>{feature}</p>
                    </div>
                ))}
            </div>
        </Card>
    )
}
