'use server'

import { getServerSession } from 'next-auth'

import { defaultCategories } from '@/consts/defaultCategories'
import { Status } from '@/enums/Status'
import { authConfig } from '@/lib/auth'
import { db } from '@/lib/prisma'
import { deleteTransactionSchema } from '@/validators/deleteTransactionSchema'
import { z } from 'zod'

import { InputDefault } from './_components/types'

export async function getUserTransactions() {
  const session = await getServerSession(authConfig)

  const transactions = await db.transaction.findMany({
    where: { userId: session?.user.id },
    orderBy: { date: 'desc' },
  })

  const enrichedTransactions = await Promise.all(
    transactions.map(async (transaction) => {
      const bankInfo = transaction.bankInfoId
        ? await db.bankInfo.findUnique({
            where: { id: transaction.bankInfoId },
          })
        : null

      let categoryName

      categoryName =
        defaultCategories.find(
          (category) => category.id === transaction?.categoryId,
        )?.name ?? ''

      if (!categoryName) {
        const categories = await getUserCategories()

        categoryName =
          categories.find((category) => category.id === transaction?.categoryId)
            ?.name ?? ''
      }

      return {
        ...transaction,
        bankInfoInstitution: bankInfo?.bankInstitution || 'Não informado',
        type: transaction.type === 'income' ? 'Receita' : 'Despesa',
        category: categoryName,
      }
    }),
  )

  return enrichedTransactions
}

export async function getUserBankInfos() {
  const session = await getServerSession(authConfig)

  const bankInfos = await db.bankInfo.findMany({
    where: { userId: session?.user?.id },
    select: {
      id: true,
      bankInstitution: true,
    },
  })

  return bankInfos
}

export async function getUserCategories() {
  const session = await getServerSession(authConfig)

  const categories = await db.category.findMany({
    where: { userId: session?.user?.id },
    select: {
      id: true,
      name: true,
      value: true,
    },
  })

  return categories
}

export async function upsertIncomeTransaction(input: InputDefault) {
  const session = await getServerSession(authConfig)

  if (!session?.user?.id) {
    return {
      error: 'Usuário não autorizado',
      data: null,
    }
  }

  const {
    id,
    amount,
    isPaid,
    description,
    category,
    bankAccount,
    date,
    isFixed,
  } = input

  if (input.id) {
    const transaction = await db.transaction.findUnique({
      where: {
        id,
        userId: session?.user?.id,
      },
      select: {
        id: true,
      },
    })

    if (!transaction) {
      return {
        error: 'Transação não encontrada',
        data: null,
      }
    }

    const updatedTransaction = await db.transaction.update({
      where: {
        id,
        userId: session?.user?.id,
      },
      data: {
        amount: parseFloat(amount),
        status: isPaid ? Status.COMPLETO : Status.PENDENTE,
        description,
        categoryId: category,
        bankInfoId: bankAccount,
        date,
        isFixed,
      },
    })

    return { error: null, data: updatedTransaction }
  }

  const transaction = await db.transaction.create({
    data: {
      type: 'income',
      amount: parseFloat(amount),
      status: isPaid ? Status.COMPLETO : Status.PENDENTE,
      description,
      categoryId: category,
      bankInfoId: bankAccount,
      date,
      isFixed,
      userId: session?.user?.id || '',
    },
  })

  return { error: null, data: transaction }
}

export async function deleteTransaction(
  input: z.infer<typeof deleteTransactionSchema>,
) {
  const session = await getServerSession(authConfig)

  if (!session?.user?.id) {
    return {
      error: 'Usuário não autorizado',
      data: null,
    }
  }

  const transaction = await db.transaction.findUnique({
    where: {
      id: input.id,
      userId: session?.user?.id,
    },
    select: {
      id: true,
    },
  })

  if (!transaction) {
    return {
      error: 'Transação não encontrada',
      data: null,
    }
  }

  await db.transaction.delete({
    where: {
      id: transaction.id,
    },
  })

  return { error: null, data: 'Transação excluída com sucesso' }
}
