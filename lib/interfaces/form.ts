import React from "react"
import type { InputHTMLAttributes, ReactNode } from "react"
import type { variantStyles } from "@/lib/constants/styles"
import type { UseFormReturn } from "react-hook-form"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string
  value: string | number
  placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  minLength?: number
  maxLength?: number
  width?: number // percentage
  height?: number // pixels
  className?: string
}

export type FormWrapperProps = {
  methods: UseFormReturn<any, any, any>;
  // onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onSubmit: any;
  title?: string;
  description?: string;
  submitLabel?: string;
  submittingLabel?: string;
  isSubmitting?: boolean;
  children: React.ReactNode;
  className?: string;
  backgroundColor?: string;
  buttonVariant?: keyof typeof variantStyles;
  width?: number
  buttonWidth?: number
  afterButtonContent?: ReactNode
  /** Pin the submit button to a sticky bar at the bottom of the form,
   *  visible only while the form is dirty (unsaved changes) — for long
   *  settings-style forms where an always-inline button scrolls out of
   *  reach. Off by default so existing short forms are unaffected. */
  stickyFooter?: boolean
};