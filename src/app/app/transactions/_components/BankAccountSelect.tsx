import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { Popover, PopoverTrigger } from '@radix-ui/react-popover'
import { CheckIcon } from 'lucide-react'

import { BankAccountSelectProps } from './types'

export function BankAccountSelect({
  form,
  label,
  name,
  data,
}: BankAccountSelectProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'col-span-3 justify-between',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  {field.value
                    ? data.find((bankAccount) => bankAccount.id === field.value)
                        ?.name
                    : 'Selecione a conta'}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Procure uma conta..."
                  className="h-9"
                />
                <CommandEmpty>Nenhuma conta encontrada.</CommandEmpty>
                <CommandGroup>
                  {data.map((bankAccount) => (
                    <CommandItem
                      value={bankAccount.name}
                      key={bankAccount.id}
                      onSelect={() => {
                        form.setValue(name, bankAccount.id)
                      }}
                    >
                      {bankAccount.name}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          bankAccount.id === field.value
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
