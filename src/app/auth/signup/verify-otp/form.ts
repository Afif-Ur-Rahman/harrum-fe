import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { VerifyOtpFormType, verifyOtpSchema } from './schema'

const useVerifyOtpForm = (intialValues?: VerifyOtpFormType) => {
  const form = useForm({
    resolver: zodResolver(verifyOtpSchema),
    reValidateMode: 'onChange',
    defaultValues: intialValues,
  })

  return form
}

export { useVerifyOtpForm }