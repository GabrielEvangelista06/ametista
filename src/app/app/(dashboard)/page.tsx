import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderTitle,
  PageLayoutMain,
} from '@/components/layouts/PageLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { DashboardCards } from './_components/DashboardCards'
import { DashboardCharts } from './_components/DashboardChart'
import { DashboardLastTransactions } from './_components/DashboardLastTransactions'
import { DashboardDonutChart } from './_components/DashboardPieChart'

export default function AppPage() {
  return (
    <PageLayout>
      <PageLayoutHeader>
        <PageLayoutHeaderTitle>Dashboard</PageLayoutHeaderTitle>
      </PageLayoutHeader>
      <PageLayoutMain>
        <Tabs defaultValue="overview">
          <TabsList className="ml-2 mt-2 lg:ml-0 lg:mt-0">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mx-2 space-y-4 md:mx-0">
            <div className="grid gap-4 md:mx-2 md:grid-cols-2 lg:grid-cols-4">
              <DashboardCards />
            </div>
            <div className="grid gap-4 md:mx-2 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 w-[22.5rem] md:w-auto">
                <CardContent>
                  <DashboardCharts />
                </CardContent>
              </Card>
              <div className="col-span-4 space-y-3 lg:col-span-3">
                <Card>
                  <CardContent>
                    <DashboardLastTransactions />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pb-3">
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
