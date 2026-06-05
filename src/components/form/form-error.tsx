import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Flex, Text } from '@radix-ui/themes'

interface FormErrorProps {
  message?: string
}

const FormError = ({ message }: FormErrorProps) =>
  message ? (
    <Flex
      align="center"
      className="rounded-3 bg-tomato-3"
      py="3"
      px="4"
      gap="3"
      mb="3"
    >
      <ExclamationTriangleIcon
        width={16}
        height={16}
        className="text-tomato-11"
      />
      <Text className="text-[12px]">{message}</Text>
    </Flex>
  ) : null

export { FormError }
