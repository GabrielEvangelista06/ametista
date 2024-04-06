import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string(),
  email: z.string().email('Insira um e-mail válido'),
})

export const deleteProfileSchema = z.object({})
