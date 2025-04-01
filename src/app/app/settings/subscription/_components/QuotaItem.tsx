import { Progress } from '@/components/ui/progress'

interface QuotaItemProps {
  label: string
  current: number
  available: number
  usage: number
}

export function QuotaItem({
  label,
  current,
  available,
  usage,
}: QuotaItemProps) {
  return (
    <div className="mt-4 space-y-2">
      <header className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {label}: {current}/{available}
        </span>
        <span className="text-sm text-muted-foreground">{usage}%</span>
      </header>
      <main>
        <Progress value={usage} />
      </main>
    </div>
  )
}
