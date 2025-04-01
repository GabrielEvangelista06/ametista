import { CategoryType } from '@/enums/CategoryType'
import { z } from 'zod'

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(1, 'Nome é obrigatório'),
  type: z.enum([CategoryType.INCOME, CategoryType.EXPENSE], {
    required_error: 'Tipo é obrigatório',
  }),
})
