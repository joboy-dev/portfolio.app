import { variantStyles } from '@/lib/constants/styles'
import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'full' | 'none'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: keyof typeof variantStyles
  size?: ButtonSize
  isLoading?: boolean
  startIcon?: ReactNode
  endIcon?: ReactNode
}

const baseStyles =
  'inline-flex items-center justify-center font-medium rounded-md transition-[color,background-color,border-color,transform] duration-(--dur-fast) ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-10 px-5',
  lg: 'h-12 px-6 text-lg',
  icon: 'h-10 w-10 shrink-0',
  full: 'w-full h-10 px-5',
  none: 'p-0',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  startIcon,
  endIcon,
  className,
  disabled,
  type="button",
  ...props
}: ButtonProps) {
  const disabledStyles = disabled || isLoading ? 'opacity-60 cursor-not-allowed active:scale-100' : ''

  return (
    <button
        type={type}
        className={clsx(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            disabledStyles,
            className
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
      {!isLoading && startIcon && <span className="mr-2 inline-flex">{startIcon}</span>}
      {children}
      {!isLoading && endIcon && <span className="ml-2 inline-flex">{endIcon}</span>}
    </button>
  )
}
