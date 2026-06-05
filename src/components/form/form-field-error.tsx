'use client'

import { Text } from '@radix-ui/themes'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/utils'

interface FormFieldErrorProps {
  name: string
  className?: string
}

const FormFieldError = ({ name, className }: FormFieldErrorProps) => {
  const form = useFormContext()
  const error = form?.getFieldState(name, form.formState).error

  return error ? (
    <Text className={cn('text-[12px] text-tomato-11', className)}>
      {error.message}
    </Text>
  ) : null
}

export { FormFieldError }
