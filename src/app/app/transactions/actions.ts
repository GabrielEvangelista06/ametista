'use server'

import { getServerSession } from 'next-auth'

import { defaultCategories } from '@/constants/defaultCategories'
import { Status } from '@/enums/Status'
import { StatusBill } from '@/enums/StatusBill'
import { TransactionTypes } from '@/enums/TransactionTypes'
import { authConfig } from '@/lib/auth'
import { db } from '@/lib/prisma'
import { deleteSchema } from '@/validators/deleteSchema'
import { updateTransactionStatusSchema } from '@/validators/updateTransctionStatus'
import { z } from 'zod'

import {
  Category,
  InputCardExpense,
  InputDefault,
  InputTransfer,
} from './_components/types'

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
          categories.find(
            (category: Category) => category.id === transaction?.categoryId,
          )?.name ?? ''
      }

      return {
        ...transaction,
        bankInfoInstitution: bankInfo?.name || 'Não informado',
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
      name: true,
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

export async function getBankInfoById(bankInfoId: string) {
  const session = await getServerSession(authConfig)

  const bankInfo = await db.bankInfo.findUnique({
    where: {
      id: bankInfoId,
      userId: session?.user?.id,
    },
  })

  return bankInfo
}

export async function upsertIncomeTransaction(input: InputDefault) {
  const session = await getServerSession(authConfig)

  if (!session?.user?.id) {
    return {
      data: null,
      title: 'Erro ao criar receita',
      message: 'Usuário não autorizado',
      error: true,
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

  if (id) {
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
        data: null,
        title: 'Erro ao atualizar receita',
        message: 'Receita não encontrada',
        error: true,
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

    if (updatedTransaction && isPaid) {
      const bankInfo = await getBankInfoById(bankAccount)

      if (bankInfo) {
        bankInfo.currentBalance += parseFloat(amount)

        await db.bankInfo.update({
          where: { id: bankAccount },
          data: { currentBalance: bankInfo.currentBalance },
        })
      }
    }

    return {
      data: updatedTransaction,
      title: 'Receita atualizada',
      message: 'Receita atualizada com sucesso',
      error: false,
    }
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

  if (transaction && isPaid) {
    const bankInfo = await getBankInfoById(bankAccount)

    if (bankInfo) {
      bankInfo.currentBalance += parseFloat(amount)

      await db.bankInfo.update({
        where: { id: bankAccount },
        data: { currentBalance: bankInfo.currentBalance },
      })
    }
  }

  return {
    data: transaction,
    title: 'Receita criada',
    message: 'Receita criada com sucesso',
    error: false,
  }
}

export async function upsertExpenseTransaction(input: InputDefault) {
  const session = await getServerSession(authConfig)

  if (!session?.user?.id) {
    return {
      data: null,
      title: 'Erro ao criar despesa',
      message: 'Usuário não autorizado',
      error: true,
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
        data: null,
        title: 'Erro ao atualizar despesa',
        message: 'Transação não encontrada',
        error: true,
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

    if (updatedTransaction && isPaid) {
      const bankInfo = await getBankInfoById(bankAccount)

      if (bankInfo) {
        bankInfo.currentBalance -= parseFloat(amount)

        await db.bankInfo.update({
          where: { id: bankAccount },
          data: { currentBalance: bankInfo.currentBalance },
        })
      }
    }

    return {
      data: updatedTransaction,
      title: 'Despesa atualizada',
      message: 'Despesa atualizada com sucesso',
      error: false,
    }
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

  if (transaction && isPaid) {
    const bankInfo = await getBankInfoById(bankAccount)

    if (bankInfo) {
      bankInfo.currentBalance -= parseFloat(amount)

      await db.bankInfo.update({
        where: { id: bankAccount },
        data: { currentBalance: bankInfo.currentBalance },
      })
    }
  }

  return {
    data: transaction,
    title: 'Despesa criada',
    message: 'Despesa criada com sucesso',
    error: false,
  }
}

export async function upsertCardExpenseTransaction(input: InputCardExpense) {
  const session = await getServerSession(authConfig)

  if (!session?.user?.id) {
    return {
      data: null,
      title: 'Erro ao criar despesa de cartão',
      message: 'Usuário não autorizado',
      error: true,
    }
  }

  const { id, amount, description, category, date, bill, card } = input

  const bankInfoId = await getBankInfoByCardId(card ?? '')

  if (id) {
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
        data: null,
        title: 'Erro ao atualizar despesa de cartão',
        message: 'Transação não encontrada',
        error: false,
      }
    }

    const updatedTransaction = await db.transaction.update({
      where: {
        id,
        userId: session?.user?.id,
      },
      data: {
        amount: parseFloat(amount),
        status: Status.PENDING,
        description,
        date,
        categoryId: category,
        bankInfoId: bankInfoId?.bankInfoId,
        cardId: card,
        billId: bill,
      },
    })

    return {
      data: updatedTransaction,
      title: 'Despesa de cartão atualizada',
      message: 'Despesa de cartão atualizada com sucesso',
      error: false,
    }
  }

  const transaction = await db.transaction.create({
    data: {
      type: TransactionTypes.CARD_EXPENSE,
      amount: parseFloat(amount),
      status: Status.PENDING,
      description,
      date,
      categoryId: category,
      userId: session.user.id,
      bankInfoId: bankInfoId?.bankInfoId,
      cardId: card,
      billId: bill,
    },
  })

  if (transaction) {
    const bill = await db.bill.findUnique({
      where: { id: transaction.billId ?? undefined },
    })

    if (bill) {
      bill.amount += parseFloat(amount)

      await db.bill.update({
        where: { id: bill.id },
        data: { amount: bill.amount },
      })
    }
  }

  return {
    data: transaction,
    title: 'Despesa de cartão criada',
    message: 'Despesa de cartão criada com sucesso',
    error: false,
  }
}

export async function upsertTransferTransaction(input: InputTransfer) {
  const session = await getServerSession(authConfig)

  if (!session?.user?.id) {
    return {
      data: null,
      title: 'Erro ao realizar transferência',
      message: 'Usuário não autorizado',
      error: true,
    }
  }

  const { id, amount, description, accountId, destinationAccount, date } = input

  const bankInfoSource = await db.bankInfo.findUnique({
    where: { id: accountId, userId: session?.user?.id },
  })

  const bankInfoDestination = await db.bankInfo.findUnique({
    where: { id: destinationAccount, userId: session?.user?.id },
  })

  if ((bankInfoSource?.currentBalance ?? 0) < parseFloat(amount)) {
    return {
      data: null,
      title: 'Erro ao realizar transferência',
      message: 'Saldo insuficiente',
      error: true,
    }
  }

  if (id) {
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
        data: null,
        title: 'Erro ao atualizar transferência',
        message: 'Transação não encontrada',
        error: true,
      }
    }

    const updatedTransaction = await db.transaction.update({
      where: {
        id,
        userId: session?.user?.id,
      },
      data: {
        amount: parseFloat(amount),
        description,
        bankInfoId: accountId,
        destinationBankInfoId: destinationAccount,
        date,
      },
    })

    return {
      data: updatedTransaction,
      title: 'Transferência atualizada',
      message: 'Transferência atualizada com sucesso',
    }
  }

  const transaction = await db.transaction.create({
    data: {
      type: TransactionTypes.TRANSFER,
      status: Status.COMPLETED,
      amount: parseFloat(amount),
      description,
      bankInfoId: accountId,
      destinationBankInfoId: destinationAccount,
      date,
      userId: session.user.id,
    },
  })

  if (transaction && bankInfoSource && bankInfoDestination) {
    bankInfoSource.currentBalance -= parseFloat(amount)
    bankInfoDestination.currentBalance += parseFloat(amount)

    await db.bankInfo.update({
      where: { id: accountId },
      data: { currentBalance: bankInfoSource.currentBalance },
    })

    await db.bankInfo.update({
      where: { id: destinationAccount },
      data: { currentBalance: bankInfoDestination.currentBalance },
    })
  }

  return {
    data: transaction,
    title: 'Transferência realizada',
    message: 'Transferência realizada com sucesso',
  }
}

export async function deleteTransaction(input: z.infer<typeof deleteSchema>) {
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

export async function updateTransactionStatus(
  input: z.infer<typeof updateTransactionStatusSchema>,
) {
  const session = await getServerSession(authConfig)

  if (!session?.user?.id) {
    return {
      error: 'Usuário não autorizado',
      data: null,
    }
  }

  const { id, status } = input

  const transaction = await db.transaction.findUnique({
    where: {
      id,
      userId: session?.user?.id,
    },
  })

  if (!transaction) {
    return {
      data: null,
      title: 'Erro ao atualizar status',
      message: 'Transação não encontrada',
      error: true,
    }
  }

  if (transaction.status === status) {
    return {
      data: null,
      title: 'Erro ao atualizar status',
      message: 'Status já está completo',
      error: true,
    }
  }

  const bankInfo = await db.bankInfo.findUnique({
    where: { id: transaction.bankInfoId!, userId: session?.user?.id },
  })

  if (!bankInfo) {
    return {
      data: null,
      title: 'Erro ao atualizar status',
      message: 'Conta não encontrada',
      error: true,
    }
  }

  if (
    transaction.type === TransactionTypes.INCOME &&
    status === Status.COMPLETED
  ) {
    bankInfo.currentBalance += transaction.amount
  }

  if (
    transaction.type === TransactionTypes.EXPENSE &&
    status === Status.COMPLETED
  ) {
    bankInfo.currentBalance -= transaction.amount
  }

  if (transaction.type === TransactionTypes.CARD_EXPENSE) {
    const bill = await db.bill.findUnique({
      where: { id: transaction.billId! },
    })

    if (bill) {
      bill.amount -= transaction.amount

      await db.bill.update({
        where: { id: bill.id },
        data: { amount: bill.amount },
      })
    }
  }

  if (transaction.type === TransactionTypes.TRANSFER) {
    const sourceBankInfo = await db.bankInfo.findUnique({
      where: {
        id: transaction.bankInfoId!,
        userId: session.user.id,
      },
    })

    const destinationBankInfo = await db.bankInfo.findUnique({
      where: {
        id: transaction.destinationBankInfoId!,
        userId: session.user.id,
      },
    })

    if (sourceBankInfo && destinationBankInfo) {
      sourceBankInfo.currentBalance -= transaction.amount
      destinationBankInfo.currentBalance += transaction.amount

      await db.bankInfo.update({
        where: { id: transaction.bankInfoId!, userId: session.user.id },
        data: { currentBalance: sourceBankInfo.currentBalance },
      })

      await db.bankInfo.update({
        where: {
          id: transaction.destinationBankInfoId!,
          userId: session.user.id,
        },
        data: { currentBalance: destinationBankInfo.currentBalance },
      })
    }
  }

  const updatedTransaction = await db.transaction.update({
    where: {
      id,
      userId: session?.user?.id,
    },
    data: {
      status,
    },
  })

  if (updatedTransaction) {
    await db.bankInfo.update({
      where: { id: transaction.bankInfoId!, userId: session?.user?.id },
      data: { currentBalance: bankInfo.currentBalance },
    })
  }

  return {
    data: updatedTransaction,
    title: 'Status atualizado',
    message: 'Status atualizado com sucesso',
    error: false,
  }
}
