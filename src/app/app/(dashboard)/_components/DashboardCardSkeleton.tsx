import { Skeleton } from '@/components/ui/skeleton'

import {
  DashboardCard,
  DashboardCardContent,
  DashboardCardHeader,
  DashboardCardHeaderTitle,
} from './DashboardCard'

export function DashboardCardSkeleton() {
  return (
    <DashboardCard className="w-[360px] bg-primary-foreground md:w-auto">
      <DashboardCardHeader>
        <DashboardCardHeaderTitle>
          <Skeleton className="h-4 w-12" />
        </DashboardCardHeaderTitle>
        <Skeleton className="h-6 w-6" />
      </DashboardCardHeader>
      <DashboardCardContent>
        <Skeleton className="h-6 w-36 lg:h-8 lg:w-32 xl:h-8" />
      </DashboardCardContent>
    </DashboardCard>
  )
}
