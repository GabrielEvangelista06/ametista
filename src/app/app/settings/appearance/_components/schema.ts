import { z } from 'zod'

export const appearanceFormSchema = z.object({
  theme: z.string(),
})
