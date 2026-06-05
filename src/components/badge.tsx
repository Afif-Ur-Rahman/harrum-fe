import { cn } from '@/utils'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Flex, Text } from '@radix-ui/themes'
import { CheckIcon, CircleAlert, Clock3Icon } from 'lucide-react'

const Badge = ({
  label,
  type,
  addIcon = false,
  className,
}: {
  label: string
  type: string
  addIcon?: boolean
  className?: string
}) => {
  const getBadgeColor = () => {
    switch (type) {
      case 'success':
        return 'border-[#30A46C] bg-green-3 text-[#18794E]'
      case 'warning':
        return 'border-[#FBDFB1] bg-[#FEF7EC] text-[#99543A]'
      case 'danger':
        return 'border-[#E5484D] bg-[#FFE5E5] text-[#E5484D]'
      case 'basic':
        return 'border-[#B9BBC6] bg-[#F9F9FB] text-[#60646C]'
      case 'highContrast':
        return 'border-[#194595] bg-[#194595] text-[white]'
      case 'info':
        return 'border-pp-info-1 bg-pp-info-2 text-pp-info-1'
      case 'disabled':
        return 'border-pp-chip-1 bg-pp-chip-1 text-pp-gray-1'
    }
  }

  return (
    <Flex
      className={cn(
        'items-center rounded-6 border px-2 py-0.5 text-[12px] font-regular',
        getBadgeColor(),
        className,
      )}
      align="center"
      justify="center"
      gap="1"
    >
      {addIcon && <Icon type={type} label={label} />}

      <Text className="whitespace-nowrap">{label}</Text>
    </Flex>
  )
}

const Icon = ({ type, label }: { type: string; label: string }) => {
  switch (type) {
    case 'success':
      return (
        <CheckIcon height="14" width="14" strokeWidth={2.5} color="green" />
      )
    case 'danger':
      return <Cross2Icon height="14" width="14" color="#E5484D" />

    case 'warning':
      if (label.toLocaleLowerCase() === 'pending')
        return <Clock3Icon height="14" width="14" color="#99543A" />
      return <CircleAlert height="14" width="14" color="#99543A" />
  }
}

export { Badge }
