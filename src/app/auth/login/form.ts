import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginFormType, loginSchema } from './schema'

const useLoginForm = (intialValues?: LoginFormType) => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    reValidateMode: 'onChange',
    defaultValues: intialValues,
  })

  return form
}

export { useLoginForm }
