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
import { defaultCategories } from '@/constants/defaultCategories'
import { cn } from '@/lib/utils'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { Popover, PopoverTrigger } from '@radix-ui/react-popover'
import { CheckIcon } from 'lucide-react'

import { CategorySelectProps } from './types'

export function CategorySelect({ form, categories }: CategorySelectProps) {
  const allCategories = defaultCategories.concat(categories)

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Categoria</FormLabel>
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
                    ? allCategories.find(
                        (category) => category.id === field.value,
                      )?.name
                    : 'Selecione a categoria'}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Procure uma categoria..."
                  className="h-9"
                />
                <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                <CommandGroup>
                  {allCategories.map((category) => (
                    <CommandItem
                      value={category.id}
                      key={category.id}
                      onSelect={() => {
                        form.setValue('category', category.id)
                      }}
                    >
                      {category.name}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          category.id === field.value
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
