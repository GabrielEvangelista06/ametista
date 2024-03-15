import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DashboardCardProps<T = any> = {
  children: React.ReactNode
  className?: string
} & T

export function DashboardCard({ className, children }: DashboardCardProps) {
  return (
    <Card className={cn(['transition-all hover:scale-105'], className)}>
      {children}
    </Card>
  )
}

export function DashboardCardHeader({
  children,
  className,
}: DashboardCardProps) {
  return (
    <CardHeader
      className={cn([
        'className="flex pb-2" flex-row items-center justify-between space-y-0',
        className,
      ])}
    >
      {children}
    </CardHeader>
  )
}

export function DashboardCardHeaderTitle({
  children,
  className,
}: DashboardCardProps) {
  return (
    <CardTitle className={cn(['text-sm font-medium', className])}>
      {children}
    </CardTitle>
  )
}

export function DashboardCardContent({
  children,
  className,
}: DashboardCardProps) {
  return <CardContent className={cn(['', className])}>{children}</CardContent>
}
