import Badge from '@/components/shared/Badge'
import { useAppSelector } from '@/lib/hooks/redux'
import { renderWithLineBreaks } from '@/lib/utils/string'
import { Heart, Lightbulb } from 'lucide-react'
import React from 'react'

export default function AboutMe() {
  const { profile } = useAppSelector(state => state.profile)
  
  return (
    <div className='min-h-screen w-full flex items-start gap-10 max-md:flex-col max-md:gap-4'>
        <div className='p-8 border border-border rounded-lg bg-secondary/50 min-h[50vh] w-full'>
            <h2 className='text-3xl font-bold mb-4 max-md:text-xl'>About Me</h2>
            <p className='text-xl max-md:text-lg text-foreground/60 font-normal leading-relaxed'>{renderWithLineBreaks(profile?.about ?? '')}</p>
        </div>

        <div className='flex flex-col gap-4 min-h-[50vh] w-full'>
            <div className='p-8 border border-border rounded-lg bg-secondary/50 h-full w-full'>
                <div className='flex items-center gap-4 mb-4'>
                    <div className='flex items-center justify-center h-12 w-12 bg-primary/20 rounded-lg'>
                        <Lightbulb className='h-6 w-6 text-primary' />
                    </div>
                    <h2 className='text-2xl font-bold max-md:text-xl'>Professional Interests</h2>
                </div>
                <div className='flex flex-wrap gap-4 mt-4'>
                    {profile?.interests?.map((interest, index) => (
                        <Badge key={index} variant='primary'>{interest}</Badge>
                    ))}
                </div>
            </div>

            <div className='p-8 border border-border rounded-lg bg-secondary/50 h-full w-full'>
                <div className='flex items-center gap-4 mb-4'>
                    <div className='flex items-center justify-center h-12 w-12 bg-primary/20 rounded-lg'>
                        <Heart className='h-6 w-6 text-primary' />
                    </div>
                    <h2 className='text-2xl font-bold max-md:text-xl'>Personal Hobbies</h2>
                </div>
                <div className='flex flex-wrap gap-4 mt-4'>
                    {profile?.hobbies?.map((hobby, index) => (
                        <Badge key={index} variant='primary'>{hobby}</Badge>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}
