import { z } from 'zod'

export const transferSchema = z.object({
  id: z.string().optional(),
  amount: z
    .string()
    .transform((v) => Number(v) || 0)
    .refine((value) => value > 0, {
      message: 'Valor deve ser um número positivo',
    }),
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
