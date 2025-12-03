'use client'

import React from 'react'
import { ClockIcon } from 'lucide-react'

export default function BlogsPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-secondary/60 to-background px-4">
            <div className="flex flex-col items-center gap-6">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-6 mb-2">
                    <ClockIcon className="w-12 h-12 text-primary animate-pulse" />
                </span>
                <h1 className="text-5xl md:text-6xl font-extrabold text-center bg-gradient-primary bg-clip-text text-transparent">
                    Blogs Coming Soon
                </h1>
                <p className="text-lg md:text-xl text-foreground/70 text-center max-w-xl">
                    I am working on insightful articles, tutorials, and stories to share with you. Stay tuned for updates!
                </p>
                <div className="mt-8">
                    <span className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold shadow-lg animate-bounce">
                        Stay Tuned 🚀
                    </span>
                </div>
            </div>
        </div>
    )
}
