import { z } from 'zod'

export const transferSchema = z.object({
  amount: z
    .string({ required_error: 'O valor da despesa é obrigatório' })
    .regex(/^\d+$/, { message: 'O valor precisa ser um número positivo' }),
  description: z
    .string({ required_error: 'A descrição é obrigatória' })
    .min(1, { message: 'A descrição é obrigatória' }),
  category: z
    .string({ required_error: 'A categoria é obrigatória' })
    .min(1, { message: 'A categoria é obrigatória' }),
  date: z.date().optional(),
  isFixed: z.boolean().optional().default(false),
  repeat: z.boolean().optional().default(false),
  isPaid: z.boolean().optional().default(false),
  accountId: z
    .string({ required_error: 'A conta é obrigatória' })
    .min(1, { message: 'A conta é obrigatória' }),
  destinationAccount: z
    .string({ required_error: 'A conta de destino é obrigatória' })
    .min(1, { message: 'A conta de destino é obrigatória' }),
  card: z.string().optional(),
  billing: z.string().optional(),
  isInstallment: z.boolean().optional().default(false),
})
