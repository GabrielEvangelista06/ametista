'use server'

import { getServerSession } from 'next-auth'

import { defaultCategories } from '@/constants/defaultCategories'
import { TransactionTypes } from '@/enums/TransactionTypes'
import { authConfig } from '@/lib/auth'
import { db } from '@/lib/prisma'

import { getUserBankInfos } from '../bank-accounts/actions'
import { getUserTransactions } from '../transactions/actions'

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

    const transactions = await getTransactionsForTheSelectedPeriod(
      session.user.id,
      type,
      startOfPeriod,
      endOfPeriod,
    )

    if (!transactions) {
      return {
        data: null,
        title: 'Sem dados',
        message: 'Não foram encontradas transações',
        error: false,
      }
    }

    const total = transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    )

    return {
      data: total,
      title: 'Dados carregados',
      message: 'Transações do mês atual carregadas com sucesso!',
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

export async function getThreeLastTransactions() {
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

    const transactions = await getUserTransactions()

    if (!transactions) {
      return {
        data: null,
        title: 'Sem dados',
        message: 'Não foram encontradas transações',
        error: false,
      }
    }

    const sortedTransactions = transactions.sort(
      (a, b) => Number(new Date(b.date)) - Number(new Date(a.date)),
    )
    const lastThreeTransactions = sortedTransactions.slice(0, 3)

    return {
      data: lastThreeTransactions,
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

    if (savings < 0) {
      return {
        data: savings,
        error: false,
        title: 'Gastos maiores que receitas',
        message: 'Você gastou mais do que recebeu nesse período.',
      }
    }

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

    const transactions = await getTransactionsForTheSelectedPeriod(
      session.user.id,
      [TransactionTypes.EXPENSE, TransactionTypes.CARD_EXPENSE],
      startOfPeriod,
      endOfPeriod,
    )

    if (!transactions) {
      return {
        data: [],
        title: 'Sem dados',
        message: 'Não foram encontradas transações',
        error: false,
      }
    }

    const totalExpense = transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
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

    const getCategoryPercentage = async (transaction: {
      categoryId: string
      amount: number
    }) => {
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
              userId: session.user.id,
            },
          })
          if (dbCategory) {
            category = dbCategory.name
          }
        }
      }

      return {
        category,
        percentage: (transaction.amount / totalExpense) * 100,
      }
    }

    const categoryPercentages = await Promise.all(
      transactions.map((transaction) =>
        getCategoryPercentage({
          categoryId: transaction.categoryId || '',
          amount: transaction.amount,
        }),
      ),
    )

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
