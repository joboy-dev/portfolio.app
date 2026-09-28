'use client'

import * as RadixTabs from '@radix-ui/react-tabs'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useState } from 'react'
import { dur, ease, spring } from '@/lib/motion'

export interface Tab {
    id: string
    label: string
    content: React.ReactNode
    icon?: React.ComponentType<{ className?: string }>
}

export default function NavigationBar({ tabs, defaultTab }: { tabs: Tab[], defaultTab?: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  return (
    <RadixTabs.Root value={activeTab} onValueChange={setActiveTab} className='w-full'>
        {tabs.length > 0 && (
            <RadixTabs.List className="relative flex flex-nowrap md:flex-wrap items-center gap-1 p-1 bg-muted rounded-lg w-full overflow-x-auto">
              {tabs.map((tab) => (
                <RadixTabs.Trigger
                  key={tab.id}
                  value={tab.id}
                  className={clsx(
                    "relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium flex-none md:flex-1 justify-center whitespace-nowrap outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring transition-colors duration-(--dur-fast)",
                    activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {activeTab === tab.id && (
                    <motion.span
                      layoutId="nav-tab-pill"
                      className="absolute inset-0 bg-background rounded-md shadow-sm -z-10"
                      transition={spring.snappy}
                    />
                  )}
                  {tab.icon && <tab.icon className="h-4 w-4 relative" />}
                  <span className="relative">{tab.label}</span>
                </RadixTabs.Trigger>
              ))}
            </RadixTabs.List>
        )}

        {tabs.map((tab) => (
          <RadixTabs.Content key={tab.id} value={tab.id} className="outline-none">
            <motion.div
              initial={{ opacity: 0, transform: 'translateY(4px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              transition={{ duration: dur.fast, ease: ease.out }}
              className="mt-4"
            >
              {tab.content}
            </motion.div>
          </RadixTabs.Content>
        ))}
    </RadixTabs.Root>
  )
}
