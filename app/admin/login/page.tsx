'use client'

import Logo from '@/components/shared/Logo'
import React, { useEffect } from 'react'
import LoginForm from './LoginForm'
import { useAuth } from '@/lib/hooks/auth/useAuth'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push("/admin");
        }
    }, [isAuthenticated, loading, router]);

    return (
        <div className='relative min-h-screen w-full flex flex-col items-center justify-center bg-secondary/50 px-4 overflow-hidden'>
            <div className="hero-texture absolute inset-0 pointer-events-none" aria-hidden="true" />

            <div className='relative flex flex-col items-center gap-2 mb-8'>
                <Logo isCollapsed />
                <p className='text-sm text-muted-foreground'>Portfolio Manager</p>
            </div>

            <div className='relative w-full max-w-sm'>
                <LoginForm />
            </div>
        </div>
    )
}
