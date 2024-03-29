import { z } from 'zod'

export const deleteTransactionSchema = z.object({
  id: z.string({ required_error: 'ID é obrigatório' }),
})
