import { z } from 'zod'

export const payBillSchema = z.object({
  billId: z.string({ required_error: 'A fatura é obrigatória' }).min(1, {
    message: 'A fatura é obrigatória',
  }),
  date: z.date().default(new Date()),
  bankAccount: z
    .string({ required_error: 'A conta é obrigatória' })
    .min(1, { message: 'A conta é obrigatória' }),
})
