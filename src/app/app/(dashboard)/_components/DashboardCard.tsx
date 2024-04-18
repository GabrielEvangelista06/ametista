import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DashboardCardProps<T = any> = {
  children: React.ReactNode
  className?: string
} & T

export function DashboardCard({ className, children }: DashboardCardProps) {
  return (
    <Card className={cn(['transition-all hover:scale-90'], className)}>
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
        'flex flex-row items-center justify-between space-y-0 pb-2',
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
