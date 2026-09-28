"use client"

import { type ReactNode } from "react";
import type { StepInterface } from "@/lib/interfaces/general";
import Button from "../button/Button";
import FormWrapper from "../form/Form";
import Dialog from "./Dialog";
import { ArrowLeft, X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import clsx from "clsx";

interface ModalProps {
  methods: UseFormReturn<any, any, any>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: any;
  title: string;
  subtitle?: string;
  steps?: StepInterface[];
  currentStep?: number;
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
  icon?: ReactNode;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  isSubmitting: boolean;
  onClose?: () => void;
  resetAfterSubmit?: boolean;
}

export default function FormModal({
  methods,
  isOpen,
  setIsOpen,
  onSubmit,
  title,
  subtitle,
  children,
  steps,
  currentStep = 0,
  setCurrentStep,
  icon,
  size = "md",
  isSubmitting,
  onClose,
  resetAfterSubmit=false
}: ModalProps) {
  const increaseStep = () => {
    if (setCurrentStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const reduceStep = () => {
    if (setCurrentStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    methods.reset();
    if (setCurrentStep) setCurrentStep(0);
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleStepSubmit = steps
    ? currentStep === steps.length - 1
      ? () => {
        onSubmit();
        if (resetAfterSubmit) {
          methods.reset();
        }
      }
      : () => increaseStep()
    : () => {
        onSubmit();
        if (resetAfterSubmit) {
          methods.reset();
        }
      };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => { if (!open) handleClose() }}
      title={title}
      description={subtitle}
      size={size}
      hideHeader
      noPadding
      closeDisabled={isSubmitting}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            {icon && (
              <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h2 className="font-bold text-xl text-foreground">{title}</h2>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>

          <button
            type="button"
            aria-label="Close"
            disabled={isSubmitting}
            onClick={handleClose}
            className="shrink-0 h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-(--dur-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Steps Progress */}
        {steps && (
          <div className="flex items-center justify-between mt-5">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={clsx(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      currentStep >= step.number
                        ? "bg-primary-strong text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step.number + 1}
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-xs font-medium text-foreground">
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={clsx(
                      "w-16 h-px mx-4",
                      currentStep > step.number ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="overflow-y-auto max-h-[65vh]">
        <FormWrapper
          methods={methods}
          onSubmit={handleStepSubmit}
          submitLabel={
            steps
              ? currentStep === steps.length - 1
                ? "Save"
                : "Next"
              : "Submit"
          }
          submittingLabel={
            steps
              ? currentStep === steps.length - 1
                ? "Saving"
                : ""
              : "Submitting"
          }
          backgroundColor="background"
          isSubmitting={isSubmitting}
          className="shadow-none m-0 w-full px-6 py-4"
        >
          {currentStep > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              startIcon={<ArrowLeft />}
              onClick={reduceStep}
              className="p-0 m-0 mb-4"
            >
              Previous
            </Button>
          )}
          {children}
        </FormWrapper>
      </div>
    </Dialog>
  );
}
