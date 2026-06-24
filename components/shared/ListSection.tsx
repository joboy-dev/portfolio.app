import React from 'react'

export default function ListSection(
    {title, subtitle, icon: Icon, children}: 
    {title: string, subtitle: string, icon: React.ElementType, children: React.ReactNode}) {
    return (
        <div className='bg-background rounded-lg p-4 mt-5 border border-border'>
            <div>
                <div className='flex items-center gap-4'>
                    <div className='flex items-center justify-center h-10 w-10 shrink-0 rounded-lg bg-primary/10'>
                        <Icon className='h-5 w-5 text-primary'/>
                    </div>
                    <h2 className='text-2xl font-semibold'>{title}</h2>
                </div>
                <p className='text-muted-foreground mt-2'>
                   {subtitle}
                </p>
            </div>

            <div className='mt-5'>
                {children}
            </div>
        </div>
    )
}
