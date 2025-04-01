import { getServerSession } from 'next-auth'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { authConfig } from '@/lib/auth'
import { getUserCurrentPlan } from '@/lib/stripe'

import { CardFooterContent } from './_components/CardFooterContent'
import { QuotaItem } from './_components/QuotaItem'
import { createCheckoutSessionAction } from './actions'

const quotas = [
  { key: 'TRANSACTIONS', label: 'Transações' },
  { key: 'BANK_INFOS', label: 'Contas' },
  { key: 'CARDS', label: 'Cartões' },
  { key: 'CATEGORIES', label: 'Categorias' },
]

export default async function SubscriptionPage() {
  const session = await getServerSession(authConfig)
  const plan = await getUserCurrentPlan(session?.user?.id as string)

  return (
    <form action={createCheckoutSessionAction}>
      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle>Uso do plano</CardTitle>
          <CardDescription>
            Atualmente você está no plano{' '}
            <span className="font-bold uppercase">Ametista {plan.name}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {quotas.map((quota) => (
            <QuotaItem
              key={quota.key}
              label={quota.label}
              current={plan.quota[quota.key as keyof typeof plan.quota].current}
              available={
                plan.quota[quota.key as keyof typeof plan.quota].available
              }
              usage={plan.quota[quota.key as keyof typeof plan.quota].usage}
            />
          ))}
        </CardContent>
        <CardFooterContent planName={plan.name as string} />
      </Card>
    </form>
  )
}
