import { Flex, Text } from '@radix-ui/themes'
import { cn } from '@/utils'

interface FormFieldLabelProps {
  id?: string
  className?: string
  required?: boolean
}

const FormFieldLabel = ({
  id,
  children,
  className,
  required,
}: React.PropsWithChildren<FormFieldLabelProps>) => {
  return (
    <Flex align="center" className={cn('text-[11px]', className)}>
      <Text as="label" wrap="nowrap" weight="medium" htmlFor={id}>
        {children}
      </Text>
      {required ? (
        <Text className="ml-0.5 text-[11px] text-red-9">*</Text>
      ) : null}
    </Flex>
  )
}

export { FormFieldLabel }
