import { z } from 'zod'

export const expenseSchema = z.object({
  id: z.string().optional(),
  amount: z
    .string({ required_error: 'O valor da receita é obrigatório' })
    .regex(/^\d+$/, { message: 'O valor precisa ser um número positivo' }),
  isPaid: z.boolean().optional().default(false),
  description: z
    .string({ required_error: 'A descrição é obrigatória' })
    .min(1, { message: 'A descrição é obrigatória' }),
  category: z
    .string({ required_error: 'A categoria é obrigatória' })
    .min(1, { message: 'A categoria é obrigatória' }),
  bankAccount: z
    .string({ required_error: 'A conta é obrigatória' })
    .min(1, { message: 'A conta é obrigatória' }),
  date: z.date().optional(),
  isFixed: z.boolean().optional().default(false),
})
