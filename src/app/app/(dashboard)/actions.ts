'use server'

import { getServerSession } from 'next-auth'

import { defaultCategories } from '@/constants/defaultCategories'
import { TransactionTypes } from '@/enums/TransactionTypes'
import { authConfig } from '@/lib/auth'
import { db } from '@/lib/prisma'

import { getUserBankInfos } from '../bank-accounts/actions'
import { getUserCategories } from '../categories/actions'

export async function getTransactionsForTheSelectedPeriod(
  userId: string,
  transactionTypes: TransactionTypes[],
  startOfPeriod: Date,
  endOfPeriod: Date,
) {
  return await db.transaction.findMany({
    where: {
      userId,
      type: {
        in: transactionTypes,
      },
      date: {
        gte: startOfPeriod,
        lte: endOfPeriod,
      },
    },
  })
}

export async function getTotalForTheSelectedPeriod(
  type: TransactionTypes[],
  startOfPeriod: Date,
  endOfPeriod: Date,
) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.id) {
      return {
        data: null,
        title: 'Usuário não autorizado',
        message: 'Usuário não autorizado',
        error: true,
      }
    }

    const total = await db.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId: session.user.id,
        type: {
          in: type,
        },
        date: {
          gte: startOfPeriod,
          lte: endOfPeriod,
        },
      },
    })

    return {
      data: total._sum.amount || 0,
      title: 'Dados carregados',
      message: 'Total carregado com sucesso!',
      error: false,
    }
  } catch (error) {
    return {
      data: null,
      title: 'Erro ao pegar dados',
      message: 'Erro ao pegar dados',
      error: true,
    }
  }
}

export async function getBalance() {
  const bankInfos = await getUserBankInfos()

  if (!bankInfos) {
    return {
      data: null,
      title: 'Erro ao pegar dados',
      message: 'Não foi possível carregar as informações bancárias',
      error: true,
    }
  }

  const balance = bankInfos.reduce(
    (sum, bankInfo) => sum + bankInfo.currentBalance,
    0,
  )

  return {
    data: balance,
    title: 'Dados carregados',
    message: 'Saldo carregado com sucesso!',
    error: false,
  }
}

export async function getThreeLastTransactions(
  startOfPeriod: Date,
  endOfPeriod: Date,
) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.id) {
      return {
        data: null,
        title: 'Usuário não autorizado',
        message: 'Usuário não autorizado',
        error: true,
      }
    }

    const transactions = await db.transaction.findMany({
      where: {
        userId: session.user.id,
        type: {
          in: [
            TransactionTypes.INCOME,
            TransactionTypes.EXPENSE,
            TransactionTypes.CARD_EXPENSE,
            TransactionTypes.TRANSFER,
          ],
        },
        date: {
          gte: startOfPeriod,
          lte: endOfPeriod,
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: 3,
    })

    if (!transactions || transactions.length === 0) {
      return {
        data: null,
        title: 'Sem dados',
        message: 'Não foram encontradas transações',
        error: false,
      }
    }

    const categories = await getUserCategories()

    const enrichedTransactions = transactions.map((transaction) => {
      const categoryName =
        defaultCategories.find(
          (category) => category.id === transaction?.categoryId,
        )?.name ??
        categories.find((category) => category.id === transaction?.categoryId)
          ?.name ??
        ''

      return {
        ...transaction,
        category: categoryName,
      }
    })

    return {
      data: enrichedTransactions,
      title: 'Dados carregados',
      message: 'Últimas transações carregadas com sucesso!',
      error: false,
    }
  } catch (error) {
    return {
      data: null,
      title: 'Erro ao pegar dados',
      message: 'Erro ao pegar últimas transações',
      error: true,
    }
  }
}

export async function calculateSavingsForPeriod(
  startOfPeriod: Date,
  endOfPeriod: Date,
): Promise<{ data: number; title: string; message: string; error: boolean }> {
  try {
    const totalIncome = await getTotalForTheSelectedPeriod(
      [TransactionTypes.INCOME],
      startOfPeriod,
      endOfPeriod,
    )
    const totalExpense = await getTotalForTheSelectedPeriod(
      [TransactionTypes.EXPENSE, TransactionTypes.CARD_EXPENSE],
      startOfPeriod,
      endOfPeriod,
    )

    if (totalIncome.error || totalExpense.error) {
      return {
        data: 0,
        error: true,
        title: 'Erro ao calcular economia',
        message: 'Não foi possível calcular a economia',
      }
    }

    if (totalIncome.data === null || totalExpense.data === null) {
      return {
        data: 0,
        error: true,
        title: 'Erro ao calcular economia',
        message: 'Não foi possível calcular a economia',
      }
    }

    const savings = totalIncome.data - totalExpense.data

    return {
      data: savings,
      error: false,
      title: 'Economia calculada',
      message: 'Você economizou nesse período!',
    }
  } catch (error) {
    return {
      data: 0,
      error: true,
      title: 'Erro ao calcular economia',
      message: 'Erro ao calcular economia',
    }
  }
}

export async function getPercentageOfExpensesByCategory(
  startOfPeriod: Date,
  endOfPeriod: Date,
): Promise<{
  data: { category: string; percentage: number }[]
  title: string
  message: string
  error: boolean
}> {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.id) {
      return {
        data: [],
        title: 'Usuário não autorizado',
        message: 'Usuário não autorizado',
        error: true,
      }
    }

    const expensesByCategory = await db.transaction.groupBy({
      by: ['categoryId'],
      _sum: {
        amount: true,
      },
      where: {
        userId: session.user.id,
        type: {
          in: [TransactionTypes.EXPENSE, TransactionTypes.CARD_EXPENSE],
        },
        date: {
          gte: startOfPeriod,
          lte: endOfPeriod,
        },
      },
    })

    if (!expensesByCategory || expensesByCategory.length === 0) {
      return {
        data: [],
        title: 'Sem dados',
        message: 'Não foram encontradas transações',
        error: false,
      }
    }

    const totalExpense = expensesByCategory.reduce(
      (sum, category) => sum + (category._sum?.amount || 0),
      0,
    )

    if (totalExpense === 0) {
      return {
        data: [],
        title: 'Sem despesas',
        message: 'Você não teve despesas nesse período',
        error: false,
      }
    }

    const userCategories = await getUserCategories()

    const categoryPercentages = expensesByCategory.map((expense) => {
      let categoryName = 'Sem categoria'

      if (expense.categoryId) {
        const foundCategory =
          defaultCategories.find(
            (defaultCategory) => defaultCategory.id === expense.categoryId,
          ) ||
          userCategories.find(
            (userCategory) => userCategory.id === expense.categoryId,
          )

        if (foundCategory) {
          categoryName = foundCategory.name
        }
      }

      return {
        category: categoryName,
        percentage: ((expense._sum?.amount || 0) / totalExpense) * 100,
      }
    })

    return {
      data: categoryPercentages,
      title: 'Dados carregados',
      message: 'Porcentagem de despesas por categoria carregada com sucesso!',
      error: false,
    }
  } catch (error) {
    return {
      data: [],
      title: 'Erro ao pegar dados',
      message: 'Erro ao pegar porcentagem de despesas por categoria',
      error: true,
    }
  }
}
