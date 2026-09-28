import clsx from 'clsx';
import { variantStyles } from '@/lib/constants/styles';
import Link from 'next/link';
import { HTMLAttributes } from 'react';

interface LinkButtonProps extends HTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof variantStyles;
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'full' | 'none';
  disabled?: boolean;
};

const baseStyles =
  'inline-flex items-center justify-center rounded-md font-medium transition-[color,background-color,border-color,transform] duration-(--dur-fast) ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.97]';

const sizeStyles = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-10 px-5',
  lg: 'h-12 px-6 text-lg',
  icon: 'h-10 w-10 shrink-0',
  full: 'w-full h-10 px-5',
  none: 'p-0',
}

/** True for anything that isn't an internal app route: http(s), mailto, tel, or a bare `#` placeholder. */
function isExternal(to: string) {
  return /^(https?:)?\/\//.test(to) || to.startsWith('mailto:') || to.startsWith('tel:')
}

export default function LinkButton({
  to,
  children,
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  ...props
}: LinkButtonProps) {
  const external = !disabled && to !== '#' && isExternal(to)

  const classes = clsx(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none active:scale-100',
    className
  )

  if (external) {
    return (
      <a href={to} target="_blank" rel="noreferrer noopener" className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <Link
      href={disabled ? '#' : to}
      aria-disabled={disabled || undefined}
      className={classes}
      {...props}
    >
      {children}
    </Link>
  );
}
