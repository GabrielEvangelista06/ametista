'use server'

import { getServerSession } from 'next-auth'

import { StatusBill } from '@/enums/StatusBill'
import { authConfig } from '@/lib/auth'
import { db } from '@/lib/prisma'
import { cardSchema } from '@/validators/cardSchema'
import { deleteSchema } from '@/validators/deleteSchema'
import { format } from 'date-fns'
import pt from 'date-fns/locale/pt'
import { z } from 'zod'

import { Card } from './types'

export async function getUserCards() {
  const session = await getServerSession(authConfig)

  const cards = await db.card.findMany({
    where: {
      userId: session?.user?.id,
    },
  })

  const cardsWithBankInfo = await Promise.all(
    cards.map(async (card) => {
      let bankInfoName = 'Sem informação do banco'

      if (card.bankInfoId) {
        const bankInfoNameFound = await db.bankInfo.findUnique({
          where: {
            id: card.bankInfoId,
          },
          select: {
            name: true,
          },
        })

        if (bankInfoNameFound && bankInfoNameFound.name) {
          bankInfoName = bankInfoNameFound.name
        }
      }

      return { ...card, bankInfoName }
    }),
  )

  return cardsWithBankInfo
}

export async function upsertCard(input: z.infer<typeof cardSchema>) {
  const session = await getServerSession(authConfig)

  if (!session?.user?.id) {
    return {
      data: null,
      title: 'Erro ao salvar cartão',
      message: 'Usuário não autorizado',
      error: true,
    }
  }

  const { id, description, limit, flag, closingDay, dueDay, bankInfo } = input

  if (id) {
    const card = await db.card.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    })

    if (!card) {
      return {
        data: null,
        title: 'Erro ao salvar cartão',
        message: 'Cartão não encontrado',
        error: true,
      }
    }

    const updatedCard = await db.card.update({
      where: {
        id: card.id,
      },
      data: {
        description,
        limit,
        flag,
        closingDay,
        dueDay,
        bankInfoId: bankInfo,
      },
    })

    return {
      data: updatedCard,
      title: 'Cartão atualizado',
      message: 'Cartão atualizado com sucesso',
      error: false,
    }
  }

  const card = await db.card.create({
    data: {
      description,
      limit,
      flag,
      closingDay,
      dueDay,
      bankInfoId: bankInfo,
      userId: session.user.id,
    },
  })

  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const currentMonthInvoice = await createBills(currentMonth, currentYear, {
    ...card,
    bankInfoName: '',
  })
  const nextMonthInvoice = await createBills(currentMonth + 1, currentYear, {
    ...card,
    bankInfoName: '',
  })

  return {
    data: {
      card,
      currentMonthInvoice,
      nextMonthInvoice,
    },
    title: 'Cartão criado',
    message: 'Cartão criado com sucesso e faturas geradas',
    error: false,
  }
}

export const createBills = async (month: number, year: number, card: Card) => {
  const monthName = format(new Date(year, month - 1), 'MMM', {
    locale: pt,
  })

  return await db.bill.create({
    data: {
      description: `Fatura de ${monthName}/${year}`,
      amount: 0,
      dueDate: new Date(year, month - 1, card.dueDay),
      status: StatusBill.OPEN,
      cardId: card.id,
    },
  })
}

export async function deleteCard(input: z.infer<typeof deleteSchema>) {
  const session = await getServerSession(authConfig)

  if (!session?.user?.id) {
    return {
      data: null,
      title: 'Erro ao deletar cartão',
      message: 'Usuário não autorizado',
      error: true,
    }
  }

  const card = await db.card.findUnique({
    where: {
      id: input.id,
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  })

  if (!card) {
    return {
      data: null,
      title: 'Erro ao deletar cartão',
      message: 'Cartão não encontrado',
      error: true,
    }
  }

  await db.card.delete({
    where: {
      id: card.id,
    },
  })

  return {
    data: null,
    title: 'Cartão deletado',
    message: 'Cartão deletado com sucesso',
    error: false,
  }
}
