'use client'

import { useEffect, useState } from 'react'

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

export function DashboardCards() {
  const [totalIncome, setTotalIncome] = useState<string>('R$ 0')
  const [totalExpense, setTotalExpense] = useState<string>('R$ 0')
  const [balance, setBalance] = useState<string>('R$ 0')
  const [savings, setSavings] = useState<string>('R$ 0')

  const getTotalIncome = async () => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

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

    const formattedIncome = response.data
      ? formatCurrency(response.data)
      : 'R$ 0'

    await new Promise((resolve) => setTimeout(resolve, 3000))

    return setTotalIncome(formattedIncome)
  }

  const getTotalExpense = async () => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

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

    const formattedExpense = response.data
      ? formatCurrency(response.data)
      : 'R$ 0'

    await new Promise((resolve) => setTimeout(resolve, 3000))

    return setTotalExpense(formattedExpense)
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

    await new Promise((resolve) => setTimeout(resolve, 3000))

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

    await new Promise((resolve) => setTimeout(resolve, 3000))

    return setSavings(formattedSavings)
  }

  useEffect(() => {
    getTotalIncome()
  }, [])

  useEffect(() => {
    getTotalExpense()
  }, [])

  useEffect(() => {
    getTotalBalance()
  }, [])
  useEffect(() => {
    getSavings()
  }, [])

  return (
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
  )
}
