import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { PopoverMoreDetailsProps } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export function PopoverMoreDetails({ children }: PopoverMoreDetailsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="link">Mais detalhes</Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-4">{children}</PopoverContent>
    </Popover>
  )
}
