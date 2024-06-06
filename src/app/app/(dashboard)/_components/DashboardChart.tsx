'use client'
import { useEffect, useState } from 'react'

import { CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'
import { TransactionTypes } from '@/enums/TransactionTypes'
import { formatCurrency } from '@/lib/formatCurrency'
import { AreaChart } from '@tremor/react'

import { getTotalForTheSelectedPeriod } from '../actions'

export function DashboardCharts() {
  const [totalIncome, setTotalIncome] = useState<number[]>([])
  const [totalExpense, setTotalExpense] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const getTotalForMonth = async (
    transactionType: TransactionTypes[],
    monthsAgo: number,
  ): Promise<number> => {
    const now = new Date()
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() - monthsAgo,
      1,
    )
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() - monthsAgo + 1,
      0,
    )

    const response = await getTotalForTheSelectedPeriod(
      transactionType,
      startOfMonth,
      endOfMonth,
    )

    if (response.error) {
      toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
      return 0
    }

    return response.data ?? 0
  }

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const incomePromises = Array.from({ length: 5 }, (_, i) =>
          getTotalForMonth([TransactionTypes.INCOME], i),
        )
        const expensePromises = Array.from({ length: 5 }, (_, i) =>
          getTotalForMonth([TransactionTypes.EXPENSE], i),
        )

        const [incomeResults, expenseResults] = await Promise.all([
          Promise.all(incomePromises),
          Promise.all(expensePromises),
        ])

        setTotalIncome(incomeResults)
        setTotalExpense(expenseResults)
      } catch (error) {
        console.error('Falha ao carregar totais:', error)
      }
    }

    fetchTotals()
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [])

  const chartdata = totalIncome.map((income, index) => {
    const month = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - index,
      1,
    )
    const monthName = month.toLocaleString('default', { month: 'short' })
    const year = month.getFullYear().toString().substr(-2)

    return {
      date: `${monthName} ${year}`,
      Receitas: income,
      Despesas: totalExpense[index],
    }
  })

  return (
    <>
      {isLoading && (
        <>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-4 w-32" />
            </CardTitle>
          </CardHeader>
          <div className="flex h-full flex-col items-center justify-center">
            <div className="ml-[19rem] mt-3 flex gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="mt-4">
              <Skeleton className="h-72 w-[31rem]" />
            </div>
          </div>
        </>
      )}

      {!isLoading && (
        <>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <AreaChart
            data={chartdata.reverse()}
            index="date"
            categories={['Receitas', 'Despesas']}
            colors={['indigo', 'rose']}
            valueFormatter={formatCurrency}
            yAxisWidth={80}
            onValueChange={(v) => console.log(v)}
          />
        </>
      )}
    </>
  )
}
