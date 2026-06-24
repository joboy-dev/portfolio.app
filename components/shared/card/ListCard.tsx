import clsx from 'clsx'
import { MoreVertical } from 'lucide-react'
import { DropdownButton, DropdownItem } from '../button/DropdownButton'
import Button from '../button/Button'

export interface PrimaryAction {
  label: string
  icon: React.ReactNode
  onSelect: () => void
  variant?: 'ghost' | 'ghostDanger'
}

export default function ListCard({
  children,
  primaryActions,
  actions,
}: {
  children: React.ReactNode
  primaryActions?: PrimaryAction[]
  actions?: DropdownItem[]
}) {
  return (
    <div
        className={clsx(
          "flex items-center justify-between p-4 hover:bg-background/10 transition-colors border-b border-border",
        )}
    >
        {children}

        <div className="flex items-center gap-1 shrink-0">
          {primaryActions?.map((action) => (
            <Button
              key={action.label}
              variant={action.variant ?? 'ghost'}
              size="sm"
              aria-label={action.label}
              title={action.label}
              onClick={action.onSelect}
            >
              {action.icon}
            </Button>
          ))}

          {actions && (
            <DropdownButton
              variant='ghost'
              size='sm'
              items={actions}
              buttonIcon={<MoreVertical className="h-4 w-4 text-muted-foreground" />}
            />
          )}
        </div>
    </div>
  )
}
