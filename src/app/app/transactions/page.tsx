import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderNav,
  PageLayoutHeaderTitle,
  PageLayoutMain,
} from '@/components/layouts/PageLayout'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

import { getUserBankInfos } from '../bank-accounts/actions'
import { getUserCards } from '../cards/actions'
import { getUserCategories } from '../categories/actions'
import { PopoverSelectTransactionType } from './_components/PopoverSelectTransactionType'
import { TransactionsDataTable } from './_components/TransactionsDataTable'
import { BankInfo, Card, Category, Transaction } from './_components/types'
import { getUserTransactions } from './actions'

export default async function TransactionsPage() {
  const transactions: Transaction[] = await getUserTransactions()
  const bankInfos: BankInfo[] = await getUserBankInfos()
  const categories: Category[] = await getUserCategories()
  const cards: Card[] = await getUserCards()

  return (
    <PageLayout>
      <PageLayoutHeader>
        <PageLayoutHeaderTitle>Transações</PageLayoutHeaderTitle>
        <PageLayoutHeaderNav>
          <PopoverSelectTransactionType
            dataBankInfos={bankInfos}
            dataCategories={categories}
            dataCards={cards}
          >
            <Button variant="outline" size="sm">
              <PlusIcon className="mr-2 h-4 w-4" />
              Adicionar transação
            </Button>
          </PopoverSelectTransactionType>
        </PageLayoutHeaderNav>
      </PageLayoutHeader>
      <PageLayoutMain>
        <TransactionsDataTable
          data={transactions}
          dataBankInfos={bankInfos}
          dataCards={cards}
        />
      </PageLayoutMain>
    </PageLayout>
  )
}
