'use server'

import { getServerSession } from 'next-auth'

import { defaultCategories } from '@/constants/defaultCategories'
import { Status } from '@/enums/Status'
import { authConfig } from '@/lib/auth'
import { db } from '@/lib/prisma'
import { payBillSchema } from '@/validators/payBillSchema'
import { z } from 'zod'

export async function getUserBillsByCardIds() {
  const session = await getServerSession(authConfig)

  const cards = await db.card.findMany({
    where: {
      userId: session?.user?.id,
    },
    select: {
      id: true,
      description: true,
    },
  })

  const bills = await db.bill.findMany({
    where: {
      cardId: {
        in: cards.map((card) => card.id),
      },
    },
  })

  return bills.map((bill) => {
    const card = cards.find((card) => card.id === bill.cardId)
    return {
      ...bill,
      cardId: card ? card.description : 'Card not found',
    }
  })
}

export async function getBillTransactions(billId: string) {
  const session = await getServerSession(authConfig)

  const billWithTransactions = await db.bill.findUnique({
    where: {
      id: billId,
    },
    include: {
      transactions: true,
    },
  })

  if (!billWithTransactions?.transactions) {
    return []
  }

  const transactionsWithCategory = await Promise.all(
    billWithTransactions.transactions.map(async (transaction) => {
      let category = 'Sem categoria'

      if (transaction.categoryId) {
        const foundCategory = defaultCategories.find(
          (defaultCategory) => defaultCategory.id === transaction.categoryId,
        )

        if (foundCategory) {
          category = foundCategory.name
        } else {
          const dbCategory = await db.category.findUnique({
            where: {
              id: transaction.categoryId,
              userId: session?.user?.id,
            },
          })
          if (dbCategory) {
            category = dbCategory.name
          }
        }
      }

      return { ...transaction, category }
    }),
  )

  return transactionsWithCategory
}

export async function markBillAsPaid(input: z.infer<typeof payBillSchema>) {
  const session = await getServerSession(authConfig)

  if (!session?.user?.id) {
    return {
      data: null,
      title: 'Usuário não autorizado',
      message: 'Usuário não autorizado',
      error: true,
    }
  }

  const { billId, bankAccount, date } = input

  const bill = await db.bill.findUnique({
    where: {
      id: billId,
    },
  })

  if (!bill) {
    return {
      data: null,
      title: 'Fatura não encontrada',
      message: 'Não foi possível encontrar a fatura selecionada',
      error: true,
    }
  }

  const bankInfo = await db.bankInfo.findUnique({
    where: {
      id: bankAccount,
    },
  })

  if (!bankInfo) {
    return {
      data: null,
      title: 'Conta não encontrada',
      message: 'Não foi possível encontrar as conta bancária selecionada',
      error: true,
    }
  }

  if (bankInfo.currentBalance < bill.amount) {
    return {
      data: null,
      title: 'Saldo insuficiente',
      message: 'Saldo insuficiente para pagar a fatura',
      error: true,
    }
  }

  if (bill.status === Status.COMPLETED) {
    return {
      data: null,
      title: 'Fatura já paga',
      message: 'A fatura selecionada já foi paga',
      error: true,
    }
  }

  const transactionsForBill = await db.transaction.findMany({
    where: {
      billId,
    },
  })

  if (!transactionsForBill) {
    return {
      data: null,
      title: 'Transações não encontradas',
      message:
        'Não foi possível encontrar as transações para a fatura selecionada',
      error: true,
    }
  }

  const transactionsIds = transactionsForBill.map(
    (transaction) => transaction.id,
  )

  const updatedTransactions = await db.transaction.updateMany({
    where: {
      id: {
        in: transactionsIds,
      },
    },
    data: {
      status: Status.COMPLETED,
    },
  })

  if (!updatedTransactions) {
    return {
      data: null,
      title: 'Erro ao marcar fatura como paga',
      message:
        'Não foi possível marcar a fatura como paga, não foi possível marcar as transações como pagas',
      error: true,
    }
  }

  const updatedBill = await db.bill.update({
    where: {
      id: billId,
    },
    data: {
      status: Status.COMPLETED,
      paidAt: date,
    },
  })

  if (!updatedBill) {
    return {
      data: null,
      title: 'Erro ao marcar fatura como paga',
      message: 'Não foi possível marcar a fatura como paga',
      error: true,
    }
  }

  await db.bankInfo.update({
    where: {
      id: bankAccount,
    },
    data: {
      currentBalance: bankInfo.currentBalance - updatedBill.amount,
    },
  })

  return {
    data: updatedBill,
    title: 'Fatura marcada como paga',
    message: 'Fatura marcada como paga com sucesso',
    error: false,
  }
}
