import { cn } from '@/utils'
import { Text, Tooltip } from '@radix-ui/themes'

interface BlockLabelProps {
  name?: string
  orientation?: 'horizontal' | 'vertical'
  className?: string
  isTooltip?: boolean
  required?: boolean
  tooltipContent?: string
}

const BlockLabel = ({
  name,
  orientation = 'horizontal',
  className,
  children,
  isTooltip = false,
  required = false,
  tooltipContent,
}: React.PropsWithChildren<BlockLabelProps>) => {
  const labelContent = (
    <Text
      as="label"
      htmlFor={name}
      className={cn('text-nowrap flex text-[12px]', className, {
        'min-h-(--chip-height)': orientation === 'horizontal',
      })}
    >
      {children}
      {required ? (
        <Text className="ml-0.5 text-[12px] text-red-9">*</Text>
      ) : null}
    </Text>
  )

  return isTooltip ? (
    <Tooltip content={tooltipContent ?? ''}>{labelContent}</Tooltip>
  ) : (
    labelContent
  )
}

export { BlockLabel }
