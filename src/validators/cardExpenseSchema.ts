import { z } from 'zod'

export const cardExpenseSchema = z.object({
  id: z.string().optional(),
  amount: z
    .union([
      z.string({ required_error: 'O valor é obrigatório' }),
      z.number({ required_error: 'O valor é obrigatório' }),
    ])
    .transform((v) => (typeof v === 'string' ? Number(v) : v))
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
  isInstallment: z.boolean().optional().default(false),
  numberRepetitions: z
    .union([z.string(), z.number()])
    .transform((v) => (typeof v === 'string' ? Number(v) : v))
    .refine((value) => value > 0, {
      message: 'Quantidade de repetições deve ser um número positivo',
    })
    .optional(),
})
