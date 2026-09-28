import React, { useId } from "react"
import type { TextareaHTMLAttributes, ReactNode } from "react"
import { useFormContext, type FieldError } from "react-hook-form"
import clsx from "clsx"

interface FormTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  name: string
  placeholder?: string
  className?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
}

const TextAreaInput: React.FC<FormTextAreaProps> = ({
  label,
  name,
  placeholder = "",
  className = "",
  id,
  ...props
}) => {
  const generatedId = useId()
  const inputId = id ?? `${name}-${generatedId}`
  const errorId = `${inputId}-error`
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name] as FieldError | undefined

  return (
    <div className="w-full mb-4">
      {label && <label htmlFor={inputId} className="block text-left text-sm font-medium text-foreground mb-1.5">{label}</label>}
      <div
        className={clsx(
          "w-full flex items-start gap-2 text-sm p-3 border rounded-md bg-transparent transition-colors duration-(--dur-fast)",
          "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring",
          error ? "border-destructive" : "border-border",
          className
        )}
      >
        <textarea
          id={inputId}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...register(name)}
          className="w-full h-24 outline-none resize-none bg-transparent text-foreground placeholder:text-muted-foreground text-sm"
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive mt-1">
          {error.message}
        </p>
      )}
    </div>
  )
}

export default TextAreaInput
