import { useState } from 'react'
import FormInput from './FormInput'
import type { InputHTMLAttributes } from "react"
import { Eye, EyeOff } from 'lucide-react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  placeholder?: string
  name?: string
}

function PasswordInput({
    label="Password",
    placeholder="Enter your password",
    name="password"
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <FormInput
        label={label}
        type={showPassword ? "text": "password"}
        placeholder={placeholder}
        name={name ?? 'password'}
        endIcon={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-(--dur-fast)"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
    />
  )
}

export default PasswordInput
