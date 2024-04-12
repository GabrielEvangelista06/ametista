import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderTitle,
  PageLayoutMain,
} from '@/components/layouts/PageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { DashboardCards } from './_components/DashboardCards'
import { DashboardCharts } from './_components/DashboardChart'
import { DashboardDonutChart } from './_components/DashboardDonutChart'
import { DashboardLastTransactions } from './_components/DashboardLastTransactions'

export default function AppPage() {
  return (
    <PageLayout>
      <PageLayoutHeader>
        <PageLayoutHeaderTitle>Dashboard</PageLayoutHeaderTitle>
      </PageLayoutHeader>
      <PageLayoutMain>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <DashboardCards />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Resumo Financeiro</CardTitle>
                </CardHeader>
                <CardContent>
                  <DashboardCharts />
                </CardContent>
              </Card>
              <div className="col-span-3 space-y-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Últimas Transações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DashboardLastTransactions />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Maiores Gastos (Categoria)</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[10.5rem]">
                    <DashboardDonutChart />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PageLayoutMain>
    </PageLayout>
  )
}
