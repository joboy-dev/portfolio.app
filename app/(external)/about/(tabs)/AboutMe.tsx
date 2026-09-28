import Badge from '@/components/shared/Badge'
import MarkdownRenderer from '@/components/shared/MarkdownRenderer'
import { useAppSelector } from '@/lib/hooks/redux'
import { Heart, Lightbulb } from 'lucide-react'
import React from 'react'

export default function AboutMe() {
  const { profile } = useAppSelector(state => state.profile)

  return (
    <div className='w-full flex items-stretch gap-10 max-md:flex-col max-md:gap-4'>
        <div className='p-8 max-sm:p-5 border border-border rounded-lg bg-secondary/50 w-full'>
            <h2 className='text-2xl font-semibold mb-4 max-md:text-xl'>About Me</h2>
            <MarkdownRenderer content={profile?.about ?? ''} className='text-lg max-md:text-base text-foreground/60 font-normal leading-relaxed max-w-[65ch]' />
        </div>

        <div className='p-8 max-sm:p-5 border border-border rounded-lg bg-secondary/50 w-full divide-y divide-border'>
            <div className='pb-6'>
                <div className='flex items-center gap-4 mb-4'>
                    <div className='flex items-center justify-center h-12 w-12 bg-primary/20 rounded-lg shrink-0'>
                        <Lightbulb className='h-6 w-6 text-primary' />
                    </div>
                    <h2 className='text-xl font-semibold max-md:text-lg'>Professional Interests</h2>
                </div>
                <div className='flex flex-wrap gap-3'>
                    {profile?.interests?.map((interest, index) => (
                        <Badge key={index} variant='primary'>{interest}</Badge>
                    ))}
                </div>
            </div>

            <div className='pt-6'>
                <div className='flex items-center gap-4 mb-4'>
                    <div className='flex items-center justify-center h-12 w-12 bg-primary/20 rounded-lg shrink-0'>
                        <Heart className='h-6 w-6 text-primary' />
                    </div>
                    <h2 className='text-xl font-semibold max-md:text-lg'>Personal Hobbies</h2>
                </div>
                <div className='flex flex-wrap gap-3'>
                    {profile?.hobbies?.map((hobby, index) => (
                        <Badge key={index} variant='primary'>{hobby}</Badge>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}
