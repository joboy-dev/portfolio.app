import React, { useId } from "react"
import { useFormContext, type FieldError } from "react-hook-form"
import type { InputHTMLAttributes, ReactNode } from "react"
import clsx from "clsx"

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  type?: string
  placeholder?: string
  className?: string,
  startIcon?: ReactNode
  endIcon?: ReactNode
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  placeholder = "",
  className = "",
  startIcon,
  endIcon,
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
      {label && (
        <label htmlFor={inputId} className="block text-left text-sm font-medium text-foreground mb-1.5">
          {label} {props.required ? <span className="text-destructive">*</span> : ""}
        </label>
      )}
      <div
        className={clsx(
          "w-full h-10 flex items-center gap-2 text-sm px-3 border rounded-md bg-transparent transition-colors duration-(--dur-fast)",
          "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring",
          error ? "border-destructive" : "border-border",
          className
        )}
      >
        {startIcon && <span className="shrink-0 text-muted-foreground">{startIcon}</span>}

        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...register(name, {
            valueAsNumber: type === "number",
          })}
          className="outline-none w-full h-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm"
          {...props}
        />

        {endIcon && <span className="shrink-0 text-muted-foreground">{endIcon}</span>}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive mt-1">
          {error.message}
        </p>
      )}
    </div>
  )
}

export default FormInput
