'use client'
import { useEffect, useState } from 'react'

import { toast } from '@/components/ui/use-toast'
import { TransactionTypes } from '@/enums/TransactionTypes'
import { formatCurrency } from '@/lib/formatCurrency'
import { AreaChart } from '@tremor/react'

import { getTotalForTheSelectedPeriod } from '../actions'

export function DashboardCharts() {
  const [totalIncome, setTotalIncome] = useState<number[]>([])
  const [totalExpense, setTotalExpense] = useState<number[]>([])

  const getTotalIncomeForMonth = async (monthsAgo: number) => {
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
      TransactionTypes.INCOME,
      startOfMonth,
      endOfMonth,
    )

    if (response.error) {
      return toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
    }

    return response.data ?? 0
  }

  const getTotalExpenseForMonth = async (monthsAgo: number) => {
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
      TransactionTypes.EXPENSE,
      startOfMonth,
      endOfMonth,
    )

    if (response.error) {
      return toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
    }

    return response.data ?? 0
  }

  useEffect(() => {
    const fetchTotalIncome = async () => {
      const incomes: number[] = []
      for (let i = 0; i < 5; i++) {
        const income = await getTotalIncomeForMonth(i)
        if (typeof income === 'number') {
          incomes.push(income)
        }
      }
      setTotalIncome(incomes)
    }
    fetchTotalIncome()
  }, [])

  useEffect(() => {
    const fetchTotalExpense = async () => {
      const expenses: number[] = []
      for (let i = 0; i < 5; i++) {
        const expense = await getTotalExpenseForMonth(i)
        if (typeof expense === 'number') {
          expenses.push(expense)
        }
      }
      setTotalExpense(expenses)
    }
    fetchTotalExpense()
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
    <AreaChart
      data={chartdata.reverse()}
      index="date"
      categories={['Receitas', 'Despesas']}
      colors={['indigo', 'rose']}
      valueFormatter={formatCurrency}
      yAxisWidth={80}
      onValueChange={(v) => console.log(v)}
    />
  )
}
