import { z } from 'zod'

export const cardExpenseSchema = z.object({
  amount: z
    .string({ required_error: 'O valor da despesa é obrigatório' })
    .regex(/^\d+$/, { message: 'O valor precisa ser um número positivo' }),
  date: z.date().optional(),
  description: z
    .string({ required_error: 'A descrição é obrigatória' })
    .min(1, 'A descrição é obrigatória'),
  category: z
    .string({ required_error: 'A categoria é obrigatória' })
    .min(1, { message: 'A categoria é obrigatória' }),
  card: z.string().optional(),
  billing: z.string().optional(),
  isInstallment: z.boolean().optional().default(false),
  isFixed: z.boolean().optional().default(false),
})
