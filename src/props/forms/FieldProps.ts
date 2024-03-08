import { UseFormReturn } from 'react-hook-form'

import { RegisterFieldNameEnum } from '@/enums/RegisterFieldNameEnum'

export interface FieldProps {
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
  name: RegisterFieldNameEnum
  label?: string
  placeholder: string
  type: string
}
