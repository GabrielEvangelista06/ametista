import { z } from 'zod'

export const cardSchema = z.object({
  id: z.string().optional(),
  description: z
    .string({ required_error: 'A descrição   é obrigatório' })
    .min(1, 'A descrição é obrigatório'),
  limit: z
    .string({ required_error: 'O limite é obrigatório' })
    .min(1, 'O limite é obrigatório')
    .transform((v) => Number(v) || 0)
    .refine((value) => value > 0, {
      message: 'O limite deve ser um número positivo',
    }),
  flag: z
    .string({ required_error: 'A bandeira é obrigatória' })
    .min(1, 'A bandeira é obrigatória'),
  closingDay: z
    .string({ required_error: 'O dia de fechamento é obrigatório' })
    .transform((v) => Number(v) || 0)
    .refine((value) => value > 0, {
      message: 'O dia de fechamento deve ser um número positivo',
    }),
  dueDay: z
    .string({ required_error: 'O dia de vencimento é obrigatório' })
    .transform((v) => Number(v) || 0)
    .refine((value) => value > 0, {
      message: 'O dia de vencimento deve ser um número positivo',
    }),
  bankInfo: z
    .string({ required_error: 'A conta é obrigatória' })
    .min(1, 'A conta é obrigatória'),
})
