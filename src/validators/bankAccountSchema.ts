import { z } from 'zod'

export const bankInfoSchema = z.object({
  id: z.string().optional(),
  currentBalance: z
    .string()
    .transform((v) => Number(v) || 0)
    .optional(),
  name: z
    .string({ required_error: 'O nome da conta é obrigatório' })
    .min(1, 'O nome da conta é obrigatório'),
  type: z
    .string({ required_error: 'O tipo da conta é obrigatório' })
    .min(1, 'O tipo da conta é obrigatório'),
})
