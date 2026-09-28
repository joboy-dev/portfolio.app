import type { ReactNode } from 'react'
import LinkButton from './button/LinkButton'
import Reveal from './motion/Reveal'

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
    <section className="page-padding">
      <Reveal
        className="relative overflow-hidden rounded-lg border border-border bg-card px-8 py-14 md:px-16 md:py-16 max-w-5xl mx-auto text-center"
      >
        <div
          className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">{heading}</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <LinkButton
              to={primaryAction.to ?? '#'}
              onClick={primaryAction.onClick}
              size="lg"
              variant="primary"
              className="font-bold"
            >
              {primaryAction.label}
              {primaryAction.icon}
            </LinkButton>

            <LinkButton
              to={secondaryAction.to ?? '#'}
              onClick={secondaryAction.onClick}
              variant="ghostPrimary"
              size="lg"
              className="font-medium"
            >
              {secondaryAction.label}
              {secondaryAction.icon}
            </LinkButton>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
