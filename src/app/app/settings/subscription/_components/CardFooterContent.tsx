import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'

interface CardFooterContentProps {
  planName: string
}

export function CardFooterContent({ planName }: CardFooterContentProps) {
  if (planName === 'free') {
    return (
      <CardFooter className="flex items-center justify-between border-t border-border pt-6">
        <span>Desbloqueie todo o potencial com Ametista Prime</span>
        <Button>Assine agora por R$50/mês</Button>
      </CardFooter>
    )
  }

  if (planName === 'prime') {
    return (
      <CardFooter className="flex items-center justify-between border-t border-border pt-6">
        <span>
          Obrigado por ser <span className="font-bold">Ametista Prime!</span>
        </span>
      </CardFooter>
    )
  }

  return null
}
