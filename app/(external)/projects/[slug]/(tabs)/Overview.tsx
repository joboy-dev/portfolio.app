import Badge from '@/components/shared/Badge'
import Card from '@/components/shared/card/Card'
import { useAppSelector } from '@/lib/hooks/redux'
import { ChartBarIcon, CheckCircleIcon } from 'lucide-react'
import React from 'react'

export default function Overview() {
    const { selectedProject } = useAppSelector(state => state.project)
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex max-sm:flex-col gap-2 items-center justify-between'>
                <Card
                    className='w-full'
                    title='Technologies Used'
                    backgroundColor='bg-background'
                >
                    <div className='flex flex-wrap gap-4'>
                        {selectedProject?.tools?.map((tool, index) => (
                            <Badge variant='secondary' key={index}>{tool}</Badge>
                        ))}
                    </div>
                </Card>

                <Card
                    className='w-full'
                    title='Project Tags'
                    backgroundColor='bg-background'
                >
                    <div className='flex flex-wrap gap-2'>
                        {selectedProject?.tags?.map((tag) => (
                            <Badge variant='outline' key={tag.id}>{tag.name}</Badge>
                        ))}
                    </div>
                </Card>
            </div>
           
            <Card
                className='w-full'
                title='Key Results'
                icon={<ChartBarIcon className='w-8 h-8 text-primary' />}
                backgroundColor='bg-primary/10'
            >
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                    {selectedProject?.results?.map((result) => (
                        <div className='flex items-center gap-2'>
                            <CheckCircleIcon className='w-5 h-5 text-primary' />
                            <p className='text-lg text-muted-foreground'>{result}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
