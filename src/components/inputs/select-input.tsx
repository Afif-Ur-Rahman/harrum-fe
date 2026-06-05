'use client'

import { cn } from '@/utils'
import { Flex, Select } from '@radix-ui/themes'
import { Controller, useFormContext } from 'react-hook-form'
import { BlockLabel } from '../block-label'

interface SelectInputProps<T> extends React.ComponentProps<typeof Select.Root> {
  label?: string
  field?: string
  options?: { label: string; value: T; disabled?: boolean }[]
  placeholder?: string
  buttonClassName?: string
  className?: string
  tooltip?: boolean
  variant?: 'classic' | 'surface' | 'soft' | 'ghost'
  loading?: boolean
}

const SelectInput = <T extends string>({
  label,
  field,
  placeholder = 'Select',
  options = [],
  className,
  buttonClassName,
  onValueChange,
  tooltip,
  variant,
  loading,
  ...selectProps
}: SelectInputProps<T>) => {
  const form = useFormContext()

  const items = options.map((option) => (
    <Select.Item
      key={option.value}
      value={option.value}
      disabled={option.disabled}
    >
      {option.label}
    </Select.Item>
  ))

  const findLabel = (value: T) => {
    const selectedOption = options.find((option) => option.value === value)
    return selectedOption ? selectedOption?.label : ''
  }

  return (
    <Flex align="center" gap="2" className={className}>
      {label && <BlockLabel name={field}>{label}</BlockLabel>}
      <Controller
        name={field ?? ''}
        control={form.control}
        render={({ field }) => {
          const { ...rest } = field
          const selectedLabel = findLabel(rest?.value)

          return (
            <Select.Root
              size="3"
              onValueChange={onValueChange ?? field.onChange}
              {...rest}
              {...selectProps}
            >
              <Select.Trigger
                variant={variant ?? 'surface'}
                placeholder={placeholder}
                title={tooltip && selectedLabel ? selectedLabel : ''}
                className={cn('h-(--chip-height)', buttonClassName, {
                  'loading hide-default-select-icon relative overflow-x-hidden':
                    loading,
                })}
              />
              <Select.Content position="popper" align="center" highContrast>
                {options?.length > 0 ? (
                  items
                ) : (
                  <Select.Item
                    value="no-data"
                    disabled
                    className="bg-white h-6 justify-center p-0 text-center text-1"
                  >
                    No data
                  </Select.Item>
                )}
              </Select.Content>
            </Select.Root>
          )
        }}
      />
    </Flex>
  )
}

export { SelectInput }
