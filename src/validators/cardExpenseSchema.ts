import { z } from 'zod'

export const cardExpenseSchema = z.object({
  id: z.string().optional(),
  amount: z
    .string({ required_error: 'O valor é obrigatório' })
    .transform((v) => Number(v) || 0)
    .refine((value) => value > 0, {
      message: 'Valor deve ser um número positivo',
    }),
  description: z
    .string({ required_error: 'A descrição é obrigatória' })
    .min(1, 'A descrição é obrigatória'),
  category: z
    .string({ required_error: 'A categoria é obrigatória' })
    .min(1, { message: 'A categoria é obrigatória' }),
  card: z.string({ required_error: 'O cartão é obrigatório' }).min(1, {
    message: 'O cartão é obrigatório',
  }),
  bill: z.string({ required_error: 'O fatura é obrigatória' }).min(1, {
    message: 'O fatura é obrigatória',
  }),
  date: z.date().default(new Date()),
  isFixed: z.boolean().optional().default(false),
})
