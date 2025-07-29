import Card from '@/components/shared/card/Card'
import { useAppSelector } from '@/lib/hooks/redux'
import { CheckCircleIcon } from 'lucide-react'
import React from 'react'
import { FaExclamation } from 'react-icons/fa6'

export default function Challenges() {
    const { selectedProject } = useAppSelector(state => state.project)
    return Object.entries(selectedProject?.challenges_and_solutions ?? {}).map(([challenge, solution]) => (
            <div className='mb-4'>
            <Card
                backgroundColor='bg-background'
            >
                <div className='flex items-start gap-2 mb-4'>
                    <div className='w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center'>
                        <FaExclamation className='text-destructive w-4 h-4'/>
                    </div>
                    <div className='flex flex-col'>
                        <p className='text-lg text-foreground font-bold'>Challenge</p>
                        <p className='text-lg text-muted-foreground'>{challenge as string}</p>
                    </div>
                </div>

                <div className='flex items-start gap-2'>
                    <div className='w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center'>
                        <CheckCircleIcon className='text-primary w-4 h-4'/>
                    </div>
                    <div className='flex flex-col'>
                        <p className='text-lg text-foreground font-bold'>Solution</p>
                        <p className='text-lg text-muted-foreground'>{solution as string}</p>
                    </div>
                </div>
            </Card>
        </div>
    ))
}
