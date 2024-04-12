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
  type: TransactionTypes,
  startOfPeriod: Date,
  endOfPeriod: Date,
) {
  const transactions = await db.transaction.findMany({
    where: {
      userId,
      type,
      createdAt: {
        gte: startOfPeriod,
        lte: endOfPeriod,
      },
    },
  })

  return transactions
}

export async function getTotalForTheSelectedPeriod(
  type: TransactionTypes,
  startOfPeriod: Date,
  endOfPeriod: Date,
) {
  const session = await getServerSession(authConfig)

  if (!session?.user?.id) {
    return {
      data: null,
      title: 'Erro ao pegar dados',
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
      title: 'Não foram encontrado dados',
      message: `Não foram encontradas ${type === TransactionTypes.INCOME ? 'receitas' : 'despesas'} para o mês atual`,
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
    message: `${type === TransactionTypes.INCOME ? 'Receitas' : 'Despesas'} do mês atual carregadas com sucesso!`,
    error: false,
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

  let balance = 0

  bankInfos.map((bankInfo) => (balance += bankInfo.currentBalance))

  return {
    data: balance,
    title: 'Dados carregados',
    message: 'Saldo carregado com sucesso!',
    error: false,
  }
}

export async function getThreeLastTransactions() {
  const session = await getServerSession(authConfig)

  if (!session?.user?.id) {
    return {
      data: null,
      title: 'Erro ao pegar dados',
      message: 'Usuário não autorizado',
      error: true,
    }
  }

  const transactions = await getUserTransactions()

  if (!transactions) {
    return {
      data: null,
      title: 'Não foram encontrado dados',
      message: 'Não foram encontradas transações',
      error: false,
    }
  }

  const sortedTransactions = transactions.sort(
    (a, b) => Number(new Date(b.date)) - Number(new Date(a.date)),
  )
  const lastFiveTransactions = sortedTransactions.slice(0, 3)

  return {
    data: lastFiveTransactions,
    title: 'Dados carregados',
    message: 'Últimas transações carregadas com sucesso!',
    error: false,
  }
}

export async function calculateSavingsForPeriod(
  startOfPeriod: Date,
  endOfPeriod: Date,
): Promise<{ data: number; title: string; message: string; error: boolean }> {
  const totalIncome = await getTotalForTheSelectedPeriod(
    TransactionTypes.INCOME,
    startOfPeriod,
    endOfPeriod,
  )
  const totalExpense = await getTotalForTheSelectedPeriod(
    TransactionTypes.EXPENSE,
    startOfPeriod,
    endOfPeriod,
  )

  if (totalIncome.error || totalExpense.error) {
    return {
      data: 0,
      error: true,
      title: 'Erro ao calcular economia',
      message:
        'Não foi possível calcular a economia para o período selecionado',
    }
  }

  if (totalIncome.data === null || totalExpense.data === null) {
    return {
      data: 0,
      error: false,
      title: 'Sem dados',
      message:
        'Não foram encontradas receitas ou despesas para o período selecionado',
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
  const session = await getServerSession(authConfig)

  if (!session?.user?.id) {
    return {
      data: [],
      title: 'Erro ao pegar dados',
      message: 'Usuário não autorizado',
      error: true,
    }
  }

  const transactions = await getTransactionsForTheSelectedPeriod(
    session.user.id,
    TransactionTypes.EXPENSE,
    startOfPeriod,
    endOfPeriod,
  )

  if (!transactions) {
    return {
      data: [],
      title: 'Não foram encontrado dados',
      message: 'Não foram encontradas despesas para o período selecionado',
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
      message: 'Não foram encontradas despesas para o período selecionado',
      error: false,
    }
  }

  const categoryPercentages = await Promise.all(
    transactions.map(async (transaction) => {
      const category = 'Sem categoria'

      if (transaction.categoryId) {
        let categoryData = ''

        defaultCategories.find((category) => {
          if (category.id === transaction.categoryId) {
            categoryData = category.name
          }
          return categoryData
        })

        if (categoryData !== '') {
          return {
            category: categoryData,
            percentage: (transaction.amount / totalExpense) * 100,
          }
        } else {
          categoryData =
            (
              await db.category.findUnique({
                where: {
                  id: transaction.categoryId,
                  userId: session.user.id,
                },
              })
            )?.name ?? 'Sem categoria'
        }
      }

      return {
        category,
        percentage: (transaction.amount / totalExpense) * 100,
      }
    }),
  )

  return {
    data: Object.values(categoryPercentages),
    title: 'Dados carregados',
    message: 'Porcentagem de despesas por categoria carregada com sucesso!',
    error: false,
  }
}
