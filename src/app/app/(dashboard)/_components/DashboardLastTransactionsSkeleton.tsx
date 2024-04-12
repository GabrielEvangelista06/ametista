import { Skeleton } from '@/components/ui/skeleton'

export function DashboardLastTransactionsSkeleton() {
  return (
    <div className="flex items-center">
      <div className="ml-4 space-y-1">
        <div className="text-sm font-medium leading-none">
          <Skeleton className="h-[1.1rem] w-36" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="ml-auto font-medium">
        <Skeleton className="h-6 w-36" />
      </div>
    </div>
  )
}
