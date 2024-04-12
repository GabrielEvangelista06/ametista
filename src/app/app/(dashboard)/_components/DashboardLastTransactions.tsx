'use client'

import { useEffect, useState } from 'react'

import { toast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import pt from 'date-fns/locale/pt'

import { Transaction } from '../../transactions/_components/types'
import { getThreeLastTransactions } from '../actions'

export function DashboardLastTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const getLastTransactions = async () => {
    const response = await getThreeLastTransactions()

    if (response.error) {
      return toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
    }

    setTransactions(response.data as Transaction[])
  }

  useEffect(() => {
    getLastTransactions()
  }, [])

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <div className="flex items-center" key={transaction.id}>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {transaction.description}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(transaction.date, 'PPP', {
                locale: pt,
              })}
              - {transaction.category}
            </p>
          </div>
          <div
            className={`ml-auto font-medium ${transaction.type === 'Receita' ? 'text-green-500' : 'text-red-500'}`}
          >
            {transaction.type === 'Receita' ? <span>+ </span> : <span>- </span>}
            {transaction.amount.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
