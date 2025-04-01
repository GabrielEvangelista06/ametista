import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderNav,
  PageLayoutHeaderTitle,
  PageLayoutMain,
} from '@/components/layouts/PageLayout'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

import { BankAccountsDataTable } from './_components/BankAccountsDataTable'
import { BankAccountUpsertSheet } from './_components/BankAccountUpsertSheet'
import { getUserBankInfos } from './actions'
import { BankInfo } from './types'

export default async function BankAccountsPage() {
  const bankInfos: BankInfo[] = await getUserBankInfos()

  return (
    <PageLayout>
      <PageLayoutHeader>
        <PageLayoutHeaderTitle>Contas</PageLayoutHeaderTitle>
        <PageLayoutHeaderNav>
          <BankAccountUpsertSheet>
            <Button variant="outline" size="sm">
              <PlusIcon className="mr-2 h-4 w-4" />
              Criar conta
            </Button>
          </BankAccountUpsertSheet>
        </PageLayoutHeaderNav>
      </PageLayoutHeader>
      <PageLayoutMain>
        <BankAccountsDataTable data={bankInfos} />
      </PageLayoutMain>
    </PageLayout>
  )
}
