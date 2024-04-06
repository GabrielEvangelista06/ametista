'use server'

import { getServerSession } from 'next-auth'

import { authConfig } from '@/lib/auth'
import { db } from '@/lib/prisma'
import { updateProfileSchema } from '@/validators/profileSchema'
import { z } from 'zod'

export async function updateProfile(
  input: z.infer<typeof updateProfileSchema>,
) {
  const session = await getServerSession(authConfig)

  if (!session?.user?.id) {
    return {
      data: null,
      title: 'Erro ao criar receita',
      message: 'Usuário não autorizado',
      error: true,
    }
  }

  const updatedUser = await db.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name: input.name,
    },
  })

  return {
    data: updatedUser,
    title: 'Perfil atualizado com sucesso',
    message: 'Seu perfil foi atualizado com sucesso',
    error: false,
  }
}
