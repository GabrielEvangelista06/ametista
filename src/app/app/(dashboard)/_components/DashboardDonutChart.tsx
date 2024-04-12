'use client'

import { useEffect, useState } from 'react'

import { CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DonutChart } from '@tremor/react'

import { getPercentageOfExpensesByCategory } from './../actions'

export function DashboardDonutChart() {
  const [categoryPercentages, setCategoryPercentages] = useState<
    { category: string; percentage: number }[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const percentageFormatter = (value: number) => `${value}%`

  useEffect(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const fetchData = async () => {
      const response = await getPercentageOfExpensesByCategory(
        startOfMonth,
        endOfMonth,
      )
      setCategoryPercentages(
        response.data.map((value) => ({
          category: value.category,
          percentage: Number(value.percentage.toFixed(1)),
        })),
      )
    }

    fetchData()

    setTimeout(() => {
      setIsLoading(false)
    }, 2500)
  }, [])

  return (
    <>
      {isLoading && (
        <>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-4 w-48" />
            </CardTitle>
          </CardHeader>
          <div className="flex animate-pulse items-center justify-center">
            <Skeleton className="h-40 w-40 rounded-full" />
          </div>
        </>
      )}
      {!isLoading && (
        <>
          <CardHeader>
            <CardTitle>Maiores Gastos (Categoria)</CardTitle>
          </CardHeader>
          <DonutChart
            data={categoryPercentages}
            valueFormatter={percentageFormatter}
            category="percentage"
            index="category"
          />
        </>
      )}
    </>
  )
}
