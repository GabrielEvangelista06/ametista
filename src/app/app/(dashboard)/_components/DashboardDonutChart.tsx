'use client'

import { useEffect, useState } from 'react'

import { DonutChart } from '@tremor/react'

import { getPercentageOfExpensesByCategory } from './../actions'

export function DashboardDonutChart() {
  const [categoryPercentages, setCategoryPercentages] = useState<
    { category: string; percentage: number }[]
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const percentageFormatter = (value: number) => `${value}%`

  useEffect(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const fetchData = async () => {
      setIsLoading(true)
      setError(false)

      try {
        const data = await getPercentageOfExpensesByCategory(
          startOfMonth,
          endOfMonth,
        )
        setCategoryPercentages(
          data.data.map((value) => ({
            category: value.category,
            percentage: Number(value.percentage.toFixed(1)),
          })),
        )
      } catch (error) {
        console.error('Erro ao pegar porcentagem', error)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <p>Carregando dados...</p>
  }

  if (error) {
    return <p>Erro ao carregar dados de porcentagem por categoria.</p>
  }

  return (
    <DonutChart
      data={categoryPercentages}
      valueFormatter={percentageFormatter}
      category="percentage"
      index="category"
    />
  )
}
