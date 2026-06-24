'use client'

import { TypingCursor } from './motion/TypewriterHeading'

export default function CodeWindow({
  name,
  role,
  stack,
  location,
}: {
  name: string
  role: string
  stack: string[]
  location?: string
}) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-[#2b2622] bg-[#0e0c0a] w-full">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#2b2622]">
        <span className="h-3 w-3 rounded-full bg-[#a49a8e]/30" />
        <span className="h-3 w-3 rounded-full bg-[#a49a8e]/30" />
        <span className="h-3 w-3 rounded-full bg-[#a49a8e]/30" />
        <span className="ml-2 font-mono text-xs text-[#a49a8e]">whoami.ts</span>
      </div>
      <div className="p-6 max-sm:p-4 font-mono text-sm leading-relaxed overflow-x-auto">
        <p className="text-[#a49a8e]">{'// currently building things that matter'}</p>
        <p>
          <span className="text-[#10b981]">const</span>{' '}
          <span className="text-[#f9f6f2]">developer</span> = {'{'}
        </p>
        <p className="pl-4">
          <span className="text-[#10b981]">name</span>:{' '}
          <span className="text-[#f9f6f2]">&quot;{name}&quot;</span>,
        </p>
        <p className="pl-4">
          <span className="text-[#10b981]">role</span>:{' '}
          <span className="text-[#f9f6f2]">&quot;{role}&quot;</span>,
        </p>
        {location && (
          <p className="pl-4">
            <span className="text-[#10b981]">location</span>:{' '}
            <span className="text-[#f9f6f2]">&quot;{location}&quot;</span>,
          </p>
        )}
        <p className="pl-4">
          <span className="text-[#10b981]">stack</span>: [
        </p>
        {stack.map((tech) => (
          <p key={tech} className="pl-8">
            <span className="text-[#f9f6f2]">&quot;{tech}&quot;</span>,
          </p>
        ))}
        <p className="pl-4">],</p>
        <p className="pl-4">
          <span className="text-[#10b981]">status</span>:{' '}
          <span className="text-[#f9f6f2]">&quot;available_for_hire&quot;</span>,
        </p>
        <p>
          {'}'}
          <TypingCursor delay={0.3} />
        </p>
      </div>
    </div>
  )
}
