import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignupFormType, signupSchema } from './schema'

const useSignupForm = (intialValues?: SignupFormType) => {
  const form = useForm({
    resolver: zodResolver(signupSchema),
    reValidateMode: 'onChange',
    defaultValues: intialValues,
  })

  return form
}

export { useSignupForm }
