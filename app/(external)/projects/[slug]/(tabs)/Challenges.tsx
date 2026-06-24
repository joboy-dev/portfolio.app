import TerminalCard from '@/components/shared/TerminalCard'
import { useAppSelector } from '@/lib/hooks/redux'
import { CheckCircleIcon } from 'lucide-react'
import React from 'react'
import { FaExclamation } from 'react-icons/fa6'

export default function Challenges() {
    const { selectedProject } = useAppSelector(state => state.project)
    const entries = Object.entries(selectedProject?.challenges_and_solutions ?? {})

    return (
        <TerminalCard label="challenges.log">
            <div className='flex flex-col gap-6'>
                {entries.map(([challenge, solution], index) => (
                    <div
                        key={challenge as string}
                        className={index !== entries.length - 1 ? 'flex flex-col gap-4 pb-6 border-b border-border' : 'flex flex-col gap-4'}
                    >
                        <div className='flex items-start gap-2'>
                            <div className='w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center shrink-0'>
                                <FaExclamation className='text-destructive w-4 h-4'/>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-lg text-foreground font-semibold'>Challenge</p>
                                <p className='text-lg text-muted-foreground'>{challenge as string}</p>
                            </div>
                        </div>

                        <div className='flex items-start gap-2'>
                            <div className='w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0'>
                                <CheckCircleIcon className='text-primary w-4 h-4'/>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-lg text-foreground font-semibold'>Solution</p>
                                <p className='text-lg text-muted-foreground'>{solution as string}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </TerminalCard>
    )
}
