'use server'

import { getServerSession } from 'next-auth'

import { defaultCategories } from '@/constants/defaultCategories'
import { authConfig } from '@/lib/auth'
import { db } from '@/lib/prisma'

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
