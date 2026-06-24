import TerminalCard from '@/components/shared/TerminalCard'
import { useAppSelector } from '@/lib/hooks/redux'
import React from 'react'

export default function Overview() {
    const { selectedProject } = useAppSelector(state => state.project)
    return (
        <TerminalCard label="technical-details.md">
            <div className='flex flex-col gap-4'>
                {Object.entries(selectedProject?.technical_details ?? {}).map(([key, value]) => (
                    <div key={key} className='flex flex-col items-start'>
                        <p className='text-lg text-primary font-semibold'>{key}</p>
                        <p className='text-lg text-muted-foreground'>{value}</p>
                    </div>
                ))}
            </div>
        </TerminalCard>
    )
}
