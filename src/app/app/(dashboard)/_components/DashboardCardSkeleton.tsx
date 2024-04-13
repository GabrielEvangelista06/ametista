import { Skeleton } from '@/components/ui/skeleton'

import {
  DashboardCard,
  DashboardCardContent,
  DashboardCardHeader,
  DashboardCardHeaderTitle,
} from './DashboardCard'

export function DashboardCardSkeleton() {
  return (
    <DashboardCard className="bg-primary-foreground">
      <DashboardCardHeader>
        <DashboardCardHeaderTitle>
          <Skeleton className="h-4 w-12" />
        </DashboardCardHeaderTitle>
        <Skeleton className="h-6 w-6" />
      </DashboardCardHeader>
      <DashboardCardContent>
        <Skeleton className="h-8 w-36" />
      </DashboardCardContent>
    </DashboardCard>
  )
}
