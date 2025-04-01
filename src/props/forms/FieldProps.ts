import { UseFormReturn } from 'react-hook-form'

import { AuthFieldNameEnum } from '@/enums/AuthFieldNameEnum'

export interface AuthFieldProps {
  form: UseFormReturn<
    {
      username?: string | undefined
      email: string
      password: string
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    {
      username?: string | undefined
      email: string
      password: string
    }
  >
  name: AuthFieldNameEnum
  label?: string
  placeholder: string
  type: string
}
