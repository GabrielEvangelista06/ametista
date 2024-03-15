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

export function DashboardCards() {
  return (
    <>
      <DashboardCard className="bg-primary-foreground">
        <DashboardCardHeader>
          <DashboardCardHeaderTitle>Saldo</DashboardCardHeaderTitle>
          <WalletIcon />
        </DashboardCardHeader>
        <DashboardCardContent>
          <div className="text-2xl font-bold">R$ 2.190,19</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </DashboardCardContent>
      </DashboardCard>

      <DashboardCard>
        <DashboardCardHeader>
          <DashboardCardHeaderTitle>Renda</DashboardCardHeaderTitle>
          <HandCoinsIcon />
        </DashboardCardHeader>
        <DashboardCardContent>
          <div className="text-2xl font-bold">R$ 21,30</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </DashboardCardContent>
      </DashboardCard>

      <DashboardCard>
        <DashboardCardHeader>
          <DashboardCardHeaderTitle>Economia</DashboardCardHeaderTitle>
          <PiggyBankIcon />
        </DashboardCardHeader>
        <DashboardCardContent>
          <div className="text-2xl font-bold">R$ 1.875,10</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </DashboardCardContent>
      </DashboardCard>

      <DashboardCard>
        <DashboardCardHeader>
          <DashboardCardHeaderTitle>Despesas</DashboardCardHeaderTitle>
          <TrendingDownIcon />
        </DashboardCardHeader>
        <DashboardCardContent>
          <div className="text-2xl font-bold">R$ 19.112,00</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </DashboardCardContent>
      </DashboardCard>
    </>
  )
}
