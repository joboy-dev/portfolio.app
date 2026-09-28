import { FormWrapperProps } from '@/lib/interfaces/form';
import Button from '../button/Button';
import { FormProvider } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { dur, ease } from '@/lib/motion';

const backgroundColorClasses: Record<string, string> = {
  transparent: 'bg-transparent',
  background: 'bg-background',
  foreground: 'bg-foreground',
  card: 'bg-card',
}

function FormWrapper({
  methods,
  onSubmit,
  title,
  description,
  submitLabel = 'Submit',
  submittingLabel = 'Submitting...',
  isSubmitting = false,
  children,
  className = '',
  buttonVariant = 'primary',
  backgroundColor = "transparent",
  width,
  buttonWidth,
  afterButtonContent,
  stickyFooter = false,
}: FormWrapperProps) {
  const isDirty = methods.formState.isDirty

  const submitButton = (
    <Button
      type='submit'
      isLoading={isSubmitting}
      variant={buttonVariant}
      style={buttonWidth ? { width: `${buttonWidth}%` } : undefined}
      className={!buttonWidth ? 'w-full' : undefined}
    >
      {isSubmitting
        ? <p>{submittingLabel}</p>
        : <p>{submitLabel}</p>
      }
    </Button>
  )

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        style={width ? { width: `${width}%` } : undefined}
        className={clsx(
          'max-md:w-full p-4 md:p-6 rounded-xl shadow-lg',
          !width && 'w-full',
          backgroundColorClasses[backgroundColor] ?? 'bg-transparent',
          className
        )}
      >
        {title && <h2 className="text-2xl max-md:text-lg text-center font-bold text-foreground mb-4">{title}</h2>}
        {description && <p className="text-md max-md:text-sm text-muted-foreground mb-4">{description}</p>}

        <div className={clsx("space-y-4", stickyFooter ? "mb-2" : "mb-4")}>{children}</div>

        {stickyFooter ? (
          <AnimatePresence>
            {isDirty && (
              <motion.div
                className="sticky bottom-4 z-(--z-dropdown) mt-4 flex items-center justify-between gap-4 rounded-lg border border-border bg-background/95 backdrop-blur-sm shadow-lg px-4 py-3"
                initial={{ opacity: 0, transform: 'translateY(8px)' }}
                animate={{ opacity: 1, transform: 'translateY(0px)' }}
                exit={{ opacity: 0, transform: 'translateY(8px)' }}
                transition={{ duration: dur.fast, ease: ease.out }}
              >
                <span className="text-sm text-muted-foreground">You have unsaved changes</span>
                {submitButton}
              </motion.div>
            )}
          </AnimatePresence>
        ) : submitButton}

        {afterButtonContent}
      </form>
    </FormProvider>
  );
}

export default FormWrapper;
