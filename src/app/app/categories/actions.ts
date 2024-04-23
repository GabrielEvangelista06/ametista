'use server'

import { getServerSession } from 'next-auth'

import { authConfig } from '@/lib/auth'
import { db } from '@/lib/prisma'
import { categorySchema } from '@/validators/categorySchema'
import { camelCase } from 'lodash'
import { z } from 'zod'

export async function getUserCategories() {
  const session = await getServerSession(authConfig)

  return await db.category.findMany({
    where: {
      userId: session?.user?.id,
    },
  })
}

export async function upsertCategory(input: z.infer<typeof categorySchema>) {
  const session = await getServerSession(authConfig)

  if (!session?.user?.id) {
    return {
      data: null,
      title: 'Erro ao salvar categoria',
      message: 'Usuário não encontrado',
      error: true,
    }
  }

  const { id, name, type } = input

  console.log(id)

  if (id) {
    const category = await db.category.findUnique({
      where: { id, userId: session.user.id },
    })

    if (!category) {
      return {
        data: null,
        title: 'Erro ao atualizar categoria',
        message: 'Categoria não encontrada',
        error: true,
      }
    }

    await db.category.update({
      where: { id },
      data: {
        name,
        categoryType: type,
        value: camelCase(name),
      },
    })

    return {
      data: null,
      title: 'Categoria atualizada',
      message: 'Categoria atualizada com sucesso',
      error: false,
    }
  }

  const createdCategory = await db.category.create({
    data: {
      name,
      categoryType: type,
      value: camelCase(name),
      userId: session.user.id,
    },
  })

  return {
    data: createdCategory,
    title: 'Categoria criada',
    message: 'Categoria criada com sucesso',
    error: false,
  }
}

export async function deleteCategory({ id }: { id: string }) {
  const session = await getServerSession(authConfig)

  if (!session?.user?.id) {
    return {
      data: null,
      title: 'Erro ao deletar categoria',
      message: 'Usuário não encontrado',
      error: true,
    }
  }

  const category = await db.category.findUnique({
    where: { id, userId: session.user.id },
  })

  if (!category) {
    return {
      data: null,
      title: 'Erro ao deletar categoria',
      message: 'Categoria não encontrada',
      error: true,
    }
  }

  await db.category.delete({
    where: { id, userId: session.user.id },
  })

  return {
    data: null,
    title: 'Categoria deletada',
    message: 'Categoria deletada com sucesso',
    error: false,
  }
}
