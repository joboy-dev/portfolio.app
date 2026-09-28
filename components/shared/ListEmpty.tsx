import { Inbox } from 'lucide-react'
import React from 'react'

export default function ListEmpty({ title, subtitle }: { title: string, subtitle?: string }) {
  return (
    <div className='flex flex-col items-center justify-center gap-3 py-16 px-4 text-center'>
      <div className='flex items-center justify-center h-12 w-12 rounded-lg bg-muted'>
        <Inbox className='h-5 w-5 text-muted-foreground' aria-hidden="true" />
      </div>
      <p className='text-base font-semibold text-foreground'>No {title} yet</p>
      {subtitle && <p className='text-sm text-muted-foreground max-w-xs'>{subtitle}</p>}
    </div>
  )
}
