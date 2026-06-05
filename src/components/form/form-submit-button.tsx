import { Button } from '@radix-ui/themes'
import { type FieldValues, type UseFormReturn } from 'react-hook-form'

type ButtonProps = Omit<React.ComponentProps<typeof Button>, 'form' | 'type'>

interface FormSubmitButtonProps<T extends FieldValues> extends ButtonProps {
  form: UseFormReturn<T>
}

const FormSubmitButton = <T extends FieldValues>({
  form,
  children,
  ...rest
}: React.PropsWithChildren<FormSubmitButtonProps<T>>) => {
  return (
    <Button type="submit" disabled={form.formState.isSubmitting} {...rest}>
      {children}
    </Button>
  )
}

export { FormSubmitButton }
