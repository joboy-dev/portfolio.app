import { InputProps } from "@/lib/interfaces/form"
import clsx from "clsx"

function TextField({
  type,
  value,
  placeholder = 'Enter input',
  onChange,
  minLength,
  maxLength,
  width = 100,
  height = 40,
  className = '',
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      minLength={minLength}
      maxLength={maxLength}
      autoComplete="on"
      className={clsx(
        "px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground rounded-md border border-border bg-transparent transition-colors duration-(--dur-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
      style={{ width: `${width}%`, height: `${height}px` }}
      {...props}
    />
  )
}

export default TextField
