import React from 'react';
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';
import { AnimatePresence, motion } from 'framer-motion';
import Button from './Button';
import { dur, ease } from '@/lib/motion';
import clsx from 'clsx';

export type DropdownItem = {
  text: string;
  onSelect: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
};

type DropdownButtonProps = {
  buttonText?: string;
  items: DropdownItem[];
  variant?: "outlineAccent" | "primary" | "secondary" | "accent" | "ghost" | "outline" | "outlineSecondary" | "danger";
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  buttonClassName?: string;
  buttonIcon?: React.ReactNode
  align?: 'start' | 'end'
};

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  buttonText,
  items,
  variant = 'outlineAccent',
  size = 'sm',
  className = '',
  buttonClassName = '',
  buttonIcon,
  align = 'end',
}) => {
  const [open, setOpen] = React.useState(false)

  return (
    <RadixDropdownMenu.Root open={open} onOpenChange={setOpen}>
      <RadixDropdownMenu.Trigger asChild>
        <Button
          variant={variant}
          size={size}
          className={clsx(className, buttonClassName)}
        >
          {buttonText}
          {buttonIcon}
        </Button>
      </RadixDropdownMenu.Trigger>

      <AnimatePresence>
        {open && (
          <RadixDropdownMenu.Portal forceMount>
            <RadixDropdownMenu.Content asChild align={align} sideOffset={8} collisionPadding={16}>
              <motion.div
                className="z-(--z-dropdown) w-60 rounded-md shadow-md p-1.5 bg-popover border border-border origin-(--radix-dropdown-menu-content-transform-origin)"
                initial={{ opacity: 0, transform: 'scale(0.97)' }}
                animate={{ opacity: 1, transform: 'scale(1)' }}
                exit={{ opacity: 0, transform: 'scale(0.97)' }}
                transition={{ duration: dur.fast, ease: ease.out }}
              >
                {items.map((item, idx) => (
                  <RadixDropdownMenu.Item
                    key={idx}
                    onSelect={item.onSelect}
                    className={clsx(
                      'cursor-pointer text-sm px-3 py-2 rounded outline-none flex items-center gap-2 transition-colors duration-(--dur-fast)',
                      item.danger
                        ? 'text-destructive data-highlighted:bg-destructive/10'
                        : 'text-foreground/80 data-highlighted:bg-muted data-highlighted:text-foreground'
                    )}
                  >
                    {item.icon}
                    {item.text}
                  </RadixDropdownMenu.Item>
                ))}
              </motion.div>
            </RadixDropdownMenu.Content>
          </RadixDropdownMenu.Portal>
        )}
      </AnimatePresence>
    </RadixDropdownMenu.Root>
  );
};
