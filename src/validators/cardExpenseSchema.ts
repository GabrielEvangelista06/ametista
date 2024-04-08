import { z } from 'zod'

export const cardExpenseSchema = z.object({
  id: z.string().optional(),
  amount: z
    .string()
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
  card: z.string().optional(),
  bill: z.string().optional(),
  isInstallment: z.boolean().optional().default(false),
  isFixed: z.boolean().optional().default(false),
  date: z.date().optional(),
})
