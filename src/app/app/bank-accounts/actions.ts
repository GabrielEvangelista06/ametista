'use server'

import { getServerSession } from 'next-auth'

import { TransactionTypes } from '@/enums/TransactionTypes'
import { authConfig } from '@/lib/auth'
import { db } from '@/lib/prisma'
import { bankInfoSchema } from '@/validators/bankAccountSchema'
import { deleteSchema } from '@/validators/deleteSchema'
import { z } from 'zod'

export async function getUserBankInfos() {
  const session = await getServerSession(authConfig)

  const bankInfos = await db.bankInfo.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: 'desc' },
  })

  const enrichedBankInfos = await Promise.all(
    bankInfos.map(async (bankInfo) => {
      const transactions = await db.transaction.findMany({
        where: { bankInfoId: bankInfo.id },
        orderBy: { date: 'desc' },
      })

      const transactionCounts = {
        incomeCount: 0,
        expenseCount: 0,
        cardExpenseCount: 0,
        transferCount: 0,
      }

      transactions.forEach((transaction) => {
        if (transaction.type === TransactionTypes.INCOME) {
          transactionCounts.incomeCount++
        } else if (transaction.type === TransactionTypes.EXPENSE) {
          transactionCounts.expenseCount++
        } else if (transaction.type === TransactionTypes.CARD_EXPENSE) {
          transactionCounts.cardExpenseCount++
        } else if (transaction.type === TransactionTypes.TRANSFER) {
          transactionCounts.transferCount++
        }
      })

      return { ...bankInfo, ...transactionCounts }
    }),
  )

  return enrichedBankInfos
}

export async function deleteBankInfo(input: z.infer<typeof deleteSchema>) {
  const session = await getServerSession(authConfig)

  if (!session?.user?.id) {
    return {
      data: null,
      title: 'Erro ao deletar conta',
      message: 'Usuário não encontrado',
      error: true,
    }
  }

  const bankInfo = await db.bankInfo.findUnique({
    where: {
      id: input.id,
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  })

  if (!bankInfo) {
    return {
      data: null,
      title: 'Erro ao deletar conta',
      message: 'Conta não encontrada',
      error: true,
    }
  }

  await db.bankInfo.delete({
    where: {
      id: bankInfo.id,
    },
  })

  return {
    data: null,
    title: 'Conta deletada',
    message: 'Conta deletada com sucesso',
    error: false,
  }
}

export async function upsertBankInfo(input: z.infer<typeof bankInfoSchema>) {
  const session = await getServerSession(authConfig)

  if (!session?.user?.id) {
    return {
      data: null,
      title: 'Erro ao salvar conta',
      message: 'Usuário não autorizado',
      error: true,
    }
  }

  const { id, name, type, currentBalance } = input

  if (id) {
    const bankInfo = await db.bankInfo.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    })

    if (!bankInfo) {
      return {
        data: null,
        title: 'Erro ao atualizar conta',
        message: 'Conta não encontrada',
        error: true,
      }
    }

    const updatedBankInfo = await db.bankInfo.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        name,
        type,
        currentBalance,
      },
    })

    return {
      data: updatedBankInfo,
      title: 'Conta atualizada',
      message: 'Conta atualizada com sucesso',
      error: false,
    }
  }

  const bankInfo = await db.bankInfo.create({
    data: {
      name,
      type,
      currentBalance: currentBalance || 0,
      userId: session.user.id,
    },
  })

  return {
    data: bankInfo,
    title: 'Conta salva',
    message: 'Conta salva com sucesso',
    error: false,
  }
}
