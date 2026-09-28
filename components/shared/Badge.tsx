'use client';

import React from "react";
import clsx from "clsx";
import { variantStyles } from "@/lib/constants/styles";

/** Static tones for non-interactive chips. Not the button variant palette:
 *  a badge should never look clickable unless it has an onClick. */
const toneStyles = {
  primary: "bg-primary-soft text-primary-strong",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  outline: "bg-transparent text-foreground/70 border border-border",
  outlineSecondary: "bg-transparent text-foreground/70 border border-border",
  outlineAccent: "bg-transparent text-foreground/70 border border-foreground/30",
  success: "bg-success-foreground text-success",
  warning: "bg-warning-foreground text-warning",
  danger: "bg-destructive/10 text-destructive",
}

type BadgeProps = {
  children: React.ReactNode;
  variant?: keyof typeof toneStyles;
  className?: string;
  /** Use the interactive Button variant palette instead of a static tone
   *  (only when this badge is actually clickable via onClick). */
  useVariantStyles?: boolean;
  onClick?: () => void;
};

export default function Badge({
  children,
  variant = "primary",
  className,
  useVariantStyles=false,
  onClick
}: BadgeProps) {
  const Component = onClick ? 'button' : 'span'

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        onClick ? "cursor-pointer transition-colors duration-(--dur-fast)" : "",
        useVariantStyles && onClick
          ? (variantStyles as Record<string, string>)[variant] ?? toneStyles[variant]
          : toneStyles[variant],
        className
      )}
    >
      {children}
    </Component>
  );
}
