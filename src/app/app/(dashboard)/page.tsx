import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderTitle,
  PageLayoutMain,
} from '@/components/layouts/PageLayout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { DashboardCards } from './_components/DashboardCards'
import { DashboardCharts } from './_components/DashboardChart'
import { DashboardLastTransactions } from './_components/DashboardLastTransactions'

export default function AppPage() {
  return (
    <PageLayout>
      <PageLayoutHeader>
        <PageLayoutHeaderTitle>Dashboard</PageLayoutHeaderTitle>
      </PageLayoutHeader>
      <PageLayoutMain className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCards />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Gastos mensais</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <DashboardCharts />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Últimas Transações</CardTitle>
              <CardDescription>
                Você fez 20 transações no Último mês.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardLastTransactions />
            </CardContent>
          </Card>
        </div>
      </PageLayoutMain>
    </PageLayout>
  )
}
