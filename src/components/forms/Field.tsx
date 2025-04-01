import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { AuthFieldProps } from '@/props/forms/FieldProps'

import { Input } from '../ui/input'

export function Field({
  form,
  label,
  name,
  placeholder,
  type,
}: AuthFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} type={type} />
          </FormControl>
          <FormMessage>{form.formState.errors[name]?.message}</FormMessage>
        </FormItem>
      )}
    />
  )
}
