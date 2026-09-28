import { FormWrapperProps } from '@/lib/interfaces/form';
import Button from '../button/Button';
import { FormProvider } from 'react-hook-form';
import clsx from 'clsx';

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
}: FormWrapperProps) {

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

        <div className="space-y-4 mb-4">{children}</div>

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

        {afterButtonContent}
      </form>
    </FormProvider>
  );
}

export default FormWrapper;
