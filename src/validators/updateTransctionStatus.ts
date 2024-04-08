import { Status } from '@/enums/Status'
import { z } from 'zod'

export const updateTransactionStatusSchema = z.object({
  id: z.string(),
  status: z.enum([Status.toString()]),
})
