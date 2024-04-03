/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react'

import { ReturnTypeWithoutPromise } from '@/types/return-type-without-promise'
import { cardExpenseSchema } from '@/validators/cardExpenseSchema'
import { incomeSchema } from '@/validators/incomeSchema'
import { transferSchema } from '@/validators/transferSchema'
import { z } from 'zod'

import {
  getUserBankInfos,
  getUserBillsByCardId,
  getUserCards,
  getUserCategories,
  getUserTransactions,
} from '../actions'

export type Transaction = ReturnTypeWithoutPromise<
  typeof getUserTransactions
>[0]

export type BankInfo = ReturnTypeWithoutPromise<typeof getUserBankInfos>[0]

export type Category = ReturnTypeWithoutPromise<typeof getUserCategories>[0]

export type Card = ReturnTypeWithoutPromise<typeof getUserCards>[0]

export type Bill = ReturnTypeWithoutPromise<typeof getUserBillsByCardId>[0]

export type TransactionsDataTableProps = {
  data: Transaction[]
}

export type TransactionUpsertSheetProps = {
  children?: ReactNode
  defaultValue?: Transaction
  dataBankInfos?: BankInfo[]
  dataCategories?: Category[]
  dataCards?: Card[]
}

export type InputDefault = z.infer<typeof incomeSchema>

export type InputTransfer = z.infer<typeof transferSchema>

export type InputCardExpense = z.infer<typeof cardExpenseSchema>

export type BankAccountSelectProps = {
  form: any
  label: string
  name: string
  data: BankInfo[]
}

export type BooleanSwitchFieldProps<T> = {
  form: T
  label: string
  name: string
  className?: string
}

export type DateSelectProps = {
  form: any
}

export type CategorySelectProps = {
  form: any
  categories: Category[]
}

export type PopoverMoreDetailsProps<T = any> = {
  children: React.ReactNode
  className?: string
} & T

export type PopoverSelectTransactionTypeProps = {
  children?: ReactNode
  dataBankInfos: BankInfo[]
  dataCategories: Category[]
  dataCards: Card[]
}

export type GenericTransactionFormFieldProps = {
  form: any
  label: string
  name:
    | 'amount'
    | 'description'
    | 'category'
    | 'date'
    | 'isFixed'
    | 'card'
    | 'billing'
    | 'isInstallment'
  placeholder: string
}
