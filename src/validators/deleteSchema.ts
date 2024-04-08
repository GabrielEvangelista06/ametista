import { z } from 'zod'

export const deleteSchema = z.object({
  id: z.string({ required_error: 'ID é obrigatório' }),
})
