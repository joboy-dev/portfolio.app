'use client'

import Logo from '@/components/shared/Logo'
import React, { useEffect, useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { useAuth } from '@/lib/hooks/auth/useAuth'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState<'login' | 'register'>('login')

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push("/admin/profile");
        }
    }, [isAuthenticated, router]);

    return (
        <div className='flex flex-col min-h-screen w-full items-center justify-center'>
            <div className='flex flex-col items-center justify-center gap-4 text-center'>
                <Logo isCollapsed/>
                <h1 className='text-5xl font-bold text-foreground'>Admin Portal</h1>
                <p className='text-muted-foreground text-lg'>Manage your portfolio content with ease</p>
            </div>

            <div className='px-10 py-4 bg-background w-full'>
                {/* Tabs */}
                <div className='flex flex-col items-center justify-center gap-4 text-center'>
                    <div className='flex items-center justify-center gap-4 text-center'>
                        <button
                            className={`w-full py-2 ${selectedTab === "login" ? "font-bold border-b-2 border-primary" : ""}`}
                            onClick={() => setSelectedTab("login")}
                        >
                            Login
                        </button>
                        <button
                            className={`w-full py-2 ${selectedTab === "register" ? "font-bold border-b-2 border-primary" : ""}`}
                            onClick={() => setSelectedTab("register")}
                        >
                            Register
                        </button>
                    </div>

                    {/* Form */}
                    <div className='flex flex-col items-center justify-center gap-4 w-full'>
                        {selectedTab === "login" && <LoginForm />}
                        {selectedTab === "register" && <RegisterForm />}
                    </div>
                </div>

            </div>
        </div>
  )
}
