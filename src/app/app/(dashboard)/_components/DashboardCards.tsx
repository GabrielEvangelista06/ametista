'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { toast } from '@/components/ui/use-toast'
import { TransactionTypes } from '@/enums/TransactionTypes'
import { formatCurrency } from '@/lib/formatCurrency'
import {
  HandCoinsIcon,
  PiggyBankIcon,
  TrendingDownIcon,
  WalletIcon,
} from 'lucide-react'

import {
  DashboardCard,
  DashboardCardContent,
  DashboardCardHeader,
  DashboardCardHeaderTitle,
} from '../_components/DashboardCard'
import {
  calculateSavingsForPeriod,
  getBalance,
  getTotalForTheSelectedPeriod,
} from '../actions'
import { DashboardCardSkeleton } from './DashboardCardSkeleton'

export function DashboardCards() {
  const [totalIncome, setTotalIncome] = useState<string>('R$ 0')
  const [totalExpense, setTotalExpense] = useState<string>('R$ 0')
  const [balance, setBalance] = useState<string>('R$ 0')
  const [savings, setSavings] = useState<string>('R$ 0')
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async (
    transactionType: TransactionTypes,
    start: Date,
    end: Date,
    setter: Dispatch<SetStateAction<string>>,
  ) => {
    const response = await getTotalForTheSelectedPeriod(
      transactionType,
      start,
      end,
    )

    if (response.error) {
      return toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
    }

    const formattedData = response.data ? formatCurrency(response.data) : 'R$ 0'

    return setter(formattedData)
  }

  const getTotalBalance = async () => {
    const response = await getBalance()

    if (response.error) {
      return toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
    }

    const formattedBalance = response.data
      ? formatCurrency(response.data)
      : 'R$ 0'

    return setBalance(formattedBalance)
  }

  const getSavings = async () => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const response = await calculateSavingsForPeriod(startOfMonth, endOfMonth)

    if (response.error) {
      return toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
    }

    const formattedSavings = response.data
      ? formatCurrency(response.data)
      : 'R$ 0'

    return setSavings(formattedSavings)
  }

  useEffect(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    fetchData(TransactionTypes.INCOME, startOfMonth, endOfMonth, setTotalIncome)
    fetchData(
      TransactionTypes.EXPENSE,
      startOfMonth,
      endOfMonth,
      setTotalExpense,
    )
    getTotalBalance()
    getSavings()

    setTimeout(() => {
      setIsLoading(false)
    }, 2500)
  }, [])

  return (
    <>
      {isLoading && (
        <>
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </>
      )}

      {!isLoading && (
        <>
          <DashboardCard className="bg-primary-foreground">
            <DashboardCardHeader>
              <DashboardCardHeaderTitle>Saldo</DashboardCardHeaderTitle>
              <WalletIcon />
            </DashboardCardHeader>
            <DashboardCardContent>
              <div className="text-2xl font-bold">{balance}</div>
            </DashboardCardContent>
          </DashboardCard>

          <DashboardCard>
            <DashboardCardHeader>
              <DashboardCardHeaderTitle>Renda</DashboardCardHeaderTitle>
              <HandCoinsIcon />
            </DashboardCardHeader>
            <DashboardCardContent>
              <div className="text-2xl font-bold">{totalIncome}</div>
            </DashboardCardContent>
          </DashboardCard>

          <DashboardCard>
            <DashboardCardHeader>
              <DashboardCardHeaderTitle>Despesas</DashboardCardHeaderTitle>
              <TrendingDownIcon />
            </DashboardCardHeader>
            <DashboardCardContent>
              <div className="text-2xl font-bold">{totalExpense}</div>
            </DashboardCardContent>
          </DashboardCard>

          <DashboardCard>
            <DashboardCardHeader>
              <DashboardCardHeaderTitle>Economia</DashboardCardHeaderTitle>
              <PiggyBankIcon />
            </DashboardCardHeader>
            <DashboardCardContent>
              <div className="text-2xl font-bold">{savings}</div>
            </DashboardCardContent>
          </DashboardCard>
        </>
      )}
    </>
  )
}
