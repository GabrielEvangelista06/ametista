'use server'

import { getServerSession } from 'next-auth'

import { defaultCategories } from '@/constants/defaultCategories'
import { Status } from '@/enums/Status'
import { StatusBill } from '@/enums/StatusBill'
import { TransactionTypes } from '@/enums/TransactionTypes'
import { authConfig } from '@/lib/auth'
import { db } from '@/lib/prisma'
import { deleteTransactionSchema } from '@/validators/deleteTransactionSchema'
import { z } from 'zod'

import { InputCardExpense, InputDefault } from './_components/types'

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
        type:
          transaction.type === TransactionTypes.INCOME
            ? 'Receita'
            : transaction.type === TransactionTypes.CARD_EXPENSE
              ? 'Despesa de Cartão'
              : transaction.type === TransactionTypes.TRANSFER
                ? 'Transferência'
                : 'Despesa',
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
      categoryType: true,
    },
  })

  return categories
}

export async function getUserCards() {
  const session = await getServerSession(authConfig)

  const cards = await db.card.findMany({
    where: { userId: session?.user?.id },
    select: {
      id: true,
      description: true,
      limit: true,
      flag: true,
      closingDate: true,
      dueDate: true,
    },
  })

  return cards
}

export async function getUserBillsByCardId(cardId: string | undefined) {
  if (!cardId) return []

  const bills = await db.bill.findMany({
    where: { cardId, status: StatusBill.OPEN },
  })

  return bills
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
        status: isPaid ? Status.COMPLETED : Status.PENDING,
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
      type: TransactionTypes.INCOME,
      amount: parseFloat(amount),
      status: isPaid ? Status.COMPLETED : Status.PENDING,
      description,
      categoryId: category,
      bankInfoId: bankAccount,
      date,
      isFixed,
      userId: session.user.id,
    },
  })

  return { error: null, data: transaction }
}

export async function upsertExpenseTransaction(input: InputDefault) {
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
        status: isPaid ? Status.COMPLETED : Status.PENDING,
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
      type: TransactionTypes.EXPENSE,
      amount: parseFloat(amount),
      status: isPaid ? Status.COMPLETED : Status.PENDING,
      description,
      categoryId: category,
      bankInfoId: bankAccount,
      date,
      isFixed,
      userId: session.user.id,
    },
  })

  return { error: null, data: transaction }
}

export async function getBankInfoByCardId(cardId: string) {
  const bankInfoId = await db.card.findFirst({
    where: {
      id: cardId,
    },
    select: {
      bankInfoId: true,
    },
  })

  return bankInfoId
}

export async function upsertCardExpenseTransaction(input: InputCardExpense) {
  const session = await getServerSession(authConfig)

  if (!session?.user?.id) {
    return {
      error: 'Usuário não autorizado',
      data: null,
    }
  }

  const { id, amount, isPaid, description, category, date, bill, card } = input

  const bankInfoId = await getBankInfoByCardId(card ?? '')

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
        status: isPaid ? Status.COMPLETED : Status.PENDING,
        description,
        date,
        categoryId: category,
        bankInfoId: bankInfoId?.bankInfoId,
        cardId: card,
        billId: bill,
      },
    })

    return { error: null, data: updatedTransaction }
  }

  const transaction = await db.transaction.create({
    data: {
      type: TransactionTypes.CARD_EXPENSE,
      amount: parseFloat(amount),
      status: isPaid ? Status.COMPLETED : Status.PENDING,
      description,
      date,
      categoryId: category,
      userId: session.user.id,
      bankInfoId: bankInfoId?.bankInfoId,
      cardId: card,
      billId: bill,
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
