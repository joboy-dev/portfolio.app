import clsx from 'clsx'

const titleSizeClasses = {
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
} as const

export default function Breadcrumb({
    title, subtitle, className="", titleSize="4xl"
}: {title: string, subtitle: string, className?: string, titleSize?: keyof typeof titleSizeClasses}) {
  return (
    <div className={className}>
        <h1 className={clsx(titleSizeClasses[titleSize], 'max-md:text-xl mb-0.5 text-foreground font-bold')}>{title}</h1>
        <p className="text-lg max-md:text-sm text-muted-foreground mt-1">{subtitle}</p>
    </div>
  )
}
