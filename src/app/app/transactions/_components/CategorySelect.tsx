import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { CategorySelectProps } from './types'

export function CategorySelect({ form, categories }: CategorySelectProps) {
  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <FormLabel>Categoria</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="h-[200px]">
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
