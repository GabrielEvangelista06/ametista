import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderTitle,
  PageLayoutMain,
} from '@/components/layouts/PageLayout'

import { BillsDataTable } from './_components/BillsDataTable'
import { getUserBillsByCardIds } from './actions'
import { Bill } from './types'

export default async function BillsPage() {
  const bills: Bill[] = await getUserBillsByCardIds()

  return (
    <PageLayout>
      <PageLayoutHeader>
        <PageLayoutHeaderTitle>Faturas</PageLayoutHeaderTitle>
      </PageLayoutHeader>
      <PageLayoutMain>
        <BillsDataTable data={bills} />
      </PageLayoutMain>
    </PageLayout>
  )
}
