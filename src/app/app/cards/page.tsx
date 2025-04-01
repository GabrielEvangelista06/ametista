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
import { BankInfo } from '../bank-accounts/types'
import { CardsDataTable } from './_components/CardsDataTable'
import { CardUpsertSheet } from './_components/CardUpsertSheet'
import { getUserCards } from './actions'
import { Card } from './types'

export default async function CardsPage() {
  const cards: Card[] = await getUserCards()
  const bankInfos: BankInfo[] = await getUserBankInfos()

  return (
    <PageLayout>
      <PageLayoutHeader>
        <PageLayoutHeaderTitle>Cartões</PageLayoutHeaderTitle>
        <PageLayoutHeaderNav>
          <CardUpsertSheet dataBankInfos={bankInfos}>
            <Button variant="outline" size="sm">
              <PlusIcon className="mr-2 h-4 w-4" />
              Criar cartão
            </Button>
          </CardUpsertSheet>
        </PageLayoutHeaderNav>
      </PageLayoutHeader>
      <PageLayoutMain>
        <CardsDataTable data={cards} dataBankInfos={bankInfos} />
      </PageLayoutMain>
    </PageLayout>
  )
}
