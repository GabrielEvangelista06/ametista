import { z } from 'zod'

export const transferSchema = z.object({
  id: z.string().optional(),
  amount: z
    .string({ required_error: 'O valor da transferência é obrigatório' })
    .regex(/^\d+$/, { message: 'O valor precisa ser um número positivo' }),
  description: z
    .string({ required_error: 'A descrição é obrigatória' })
    .min(1, { message: 'A descrição é obrigatória' }),
  accountId: z
    .string({ required_error: 'A conta é obrigatória' })
    .min(1, { message: 'A conta é obrigatória' }),
  destinationAccount: z
    .string({ required_error: 'A conta de destino é obrigatória' })
    .min(1, { message: 'A conta de destino é obrigatória' }),
  date: z.date().optional(),
})
