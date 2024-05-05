'use client'

import { useEffect, useState } from 'react'

import { CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import pt from 'date-fns/locale/pt'

import { Transaction } from '../../transactions/_components/types'
import { getThreeLastTransactions } from '../actions'
import { DashboardLastTransactionsSkeleton } from './DashboardLastTransactionsSkeleton'

export function DashboardLastTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

    setTimeout(() => {
      setIsLoading(false)
    }, 2500)
  }, [])

  return (
    <div>
      {isLoading && (
        <>
          <CardHeader className="-ml-5">
            <CardTitle>
              <Skeleton className="h-4 w-36" />
            </CardTitle>
          </CardHeader>
          <div className="space-y-2">
            <DashboardLastTransactionsSkeleton />
            <DashboardLastTransactionsSkeleton />
            <DashboardLastTransactionsSkeleton />
          </div>
        </>
      )}

      {!isLoading && (
        <>
          <CardHeader className="-ml-5">
            <CardTitle>Últimas Transações</CardTitle>
          </CardHeader>
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
                    {''} - {transaction.category}
                  </p>
                </div>
                <div
                  className={`ml-auto font-medium ${
                    transaction.type === 'Receita'
                      ? 'text-green-500'
                      : transaction.type === 'Transferência'
                        ? 'text-foreground'
                        : 'text-red-500'
                  }`}
                >
                  {transaction.type === 'Receita' ? (
                    <span>+ </span>
                  ) : transaction.type === 'Transferência' ? (
                    <span></span>
                  ) : (
                    <span>- </span>
                  )}
                  {transaction.amount.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!isLoading && transactions.length === 0 && (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          Nenhuma transação encontrada
        </div>
      )}
    </div>
  )
}
