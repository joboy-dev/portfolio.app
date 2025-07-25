'use client'

import FormWrapper from '@/components/shared/form/Form'
import FormInput from '@/components/shared/form/FormInput'
import PasswordInput from '@/components/shared/form/PasswordInput'
import { useZodForm } from '@/lib/hooks/useZodForm'
import { AuthFormData, authSchema } from '@/lib/validators/auth'
import { login } from '@/lib/redux/slices/auth/auth'
import { RootState } from '@/lib/redux/store'
import React from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'

export default function LoginForm() {
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state: RootState) => state.auth)
  
  const methods = useZodForm<AuthFormData>(authSchema)
  const loginUser = async (data: AuthFormData) => {
    dispatch(login(data));
  }
  
  return (
    <div>
        <FormWrapper  
          methods={methods}
          onSubmit={methods.handleSubmit(loginUser)}
          submitLabel="Sign In"
          submittingLabel="Signing in..."
          isSubmitting={isLoading}
          buttonVariant="primary"
          backgroundColor="foreground"
          width={45}
          title="Welcome back"
          description='Sign in to access your admin dashboard'
          className='shadow-primary/20'
        >
          <FormInput
            name="email"
            label="Emai Address"
            placeholder="Enter your email"
            type="email"
          />

          <PasswordInput/>
        </FormWrapper>
    </div>
  )
}
