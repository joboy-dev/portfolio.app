'use client'

import FormWrapper from '@/components/shared/form/Form'
import FormInput from '@/components/shared/form/FormInput'
import PasswordInput from '@/components/shared/form/PasswordInput'
import { useZodForm } from '@/lib/hooks/useZodForm'
import { AuthFormData, authSchema } from '@/lib/validators/auth'
import { signUp } from '@/lib/redux/slices/auth/auth'
import { RootState } from '@/lib/redux/store'
import React from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'

export default function RegisterForm() {
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state: RootState) => state.auth)
  
  const methods = useZodForm<AuthFormData>(authSchema)
  const register = async (data: AuthFormData) => {
    dispatch(signUp(data));
  }
  
  return (
    <div>
        <FormWrapper
          methods={methods}
          onSubmit={methods.handleSubmit(register)}
          submitLabel="Register"
          submittingLabel="Registering..."
          isSubmitting={isLoading}
          buttonVariant="primary"
          backgroundColor="foreground"
          width={45}
          title="Register"
          description='Set up your admin account to get started'
          className='shadow-primary/20'
        >
          <FormInput
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            type="email"
          />
          <PasswordInput/>

        </FormWrapper>
    </div>
  )
}
