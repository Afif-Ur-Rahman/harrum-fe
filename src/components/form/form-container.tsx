'use client'

import {
  FormProvider,
  SubmitErrorHandler,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form'
import { cn } from '@/utils'

interface FormContainerProps<T extends FieldValues> {
  className?: string
  form: UseFormReturn<T>
  formClassName?: string
  onSubmit: SubmitHandler<T>
  onError?: SubmitErrorHandler<T>
  disabled?: boolean
}

const FormContainer = <T extends FieldValues>({
  form,
  className,
  formClassName,
  onSubmit,
  onError,
  children,
  disabled,
}: React.PropsWithChildren<FormContainerProps<T>>) => (
  <FormProvider {...form}>
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit(onSubmit, onError)(e)
      }}
      className={cn('flex flex-1 flex-col', formClassName)}
    >
      <fieldset
        disabled={
          form.formState.isSubmitting || disabled || form.formState.disabled
        }
        className={cn('flex flex-1 flex-col', className)}
      >
        {children}
      </fieldset>
    </form>
  </FormProvider>
)

export { FormContainer }
