import React from 'react'

export default function ListEmpty({ title }: { title: string }) {
  return (
    <div className='flex items-center justify-center h-[50vh]'>
        <p className='text-lg font-bold text-foreground/60'>No {title} found</p>
    </div>
  )
}
