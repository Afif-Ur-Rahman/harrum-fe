'use client'

import { Flex, TextArea } from '@radix-ui/themes'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/utils'
import { BlockLabel } from '../block-label'

interface TextAreaInputProps {
  label?: string
  field: string
  autoFocus?: boolean
  className?: string
  placeHolder?: string
  maxLength?: number
  formContainerClassName?: string
  disabled?: boolean
}

const TextAreaInput = ({
  label,
  field,
  autoFocus,
  className,
  placeHolder,
  maxLength,
  formContainerClassName,
  disabled = false,
}: TextAreaInputProps) => {
  const form = useFormContext()

  return (
    <Flex
      align="center"
      gap="2"
      className={cn('w-full', formContainerClassName)}
    >
      {label && <BlockLabel name={field}>{label}</BlockLabel>}
      <TextArea
        disabled={disabled}
        size="1"
        autoFocus={autoFocus}
        className={cn('h-(--chip-height)', className)}
        placeholder={placeHolder}
        maxLength={maxLength}
        {...form.register(field)}
      />
    </Flex>
  )
}

export { TextAreaInput }
