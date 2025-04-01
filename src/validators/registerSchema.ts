import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().min(1, { message: 'O nome de usuário é obrigatório' }),
  email: z
    .string()
    .min(1, { message: 'O e-mail é obrigatório' })
    .email('Insira um e-mail válido'),
  password: z
    .string()
    .min(1, { message: 'A senha é obrigatória' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/, {
      message:
        'A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
    })
    .max(255, {
      message: 'A senha deve ter no máximo 255 caracteres',
    }),
})
