import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderNav,
  PageLayoutHeaderTitle,
  PageLayoutMain,
} from '@/components/layouts/PageLayout'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

import { PopoverSelectTransactionType } from './_components/PopoverSelectTransactionType'
import { TransactionsDataTable } from './_components/TransactionsDataTable'
import {
  getUserBankInfos,
  getUserCategories,
  getUserTransactions,
} from './actions'

export default async function TransactionsPage() {
  const transactions = await getUserTransactions()
  const bankInfos = await getUserBankInfos()
  const categories = await getUserCategories()

  return (
    <PageLayout>
      <PageLayoutHeader>
        <PageLayoutHeaderTitle>Transações</PageLayoutHeaderTitle>
        <PageLayoutHeaderNav>
          <PopoverSelectTransactionType
            dataBankInfos={bankInfos}
            dataCategories={categories}
          >
            <Button variant="outline" size="sm">
              <PlusIcon className="mr-2 h-4 w-4" />
              Adicionar transação
            </Button>
          </PopoverSelectTransactionType>
        </PageLayoutHeaderNav>
      </PageLayoutHeader>
      <PageLayoutMain>
        <TransactionsDataTable data={transactions} />
      </PageLayoutMain>
    </PageLayout>
  )
}
