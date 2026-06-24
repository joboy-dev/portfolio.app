import type { ReactNode } from 'react'
import LinkButton from './button/LinkButton'

interface CTAAction {
  label: string
  icon?: ReactNode
  to?: string
  onClick?: () => void
}

export default function CTASection({
  heading,
  subtitle,
  primaryAction,
  secondaryAction,
}: {
  heading: string
  subtitle: string
  primaryAction: CTAAction
  secondaryAction: CTAAction
}) {
  return (
    <section className="page-padding bg-gradient-primary">
      <div className="max-w-4xl mx-auto text-center pb-12">
        <h2 className="text-4xl font-semibold text-primary-foreground mb-6 text-center">{heading}</h2>
        <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed font-medium text-center">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <LinkButton
            to={primaryAction.to ?? '#'}
            onClick={primaryAction.onClick}
            size="lg"
            variant="ghost"
            className="bg-white text-lg font-medium text-primary"
          >
            {primaryAction.label}
            {primaryAction.icon}
          </LinkButton>

          <LinkButton
            to={secondaryAction.to ?? '#'}
            onClick={secondaryAction.onClick}
            variant="outline"
            size="lg"
            className="border-2 border-white text-white px-8 py-4 text-lg font-medium"
          >
            {secondaryAction.label}
            {secondaryAction.icon}
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
