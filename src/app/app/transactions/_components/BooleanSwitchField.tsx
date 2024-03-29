import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

import { BooleanSwitchFieldProps } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BooleanSwitchField<T extends { control: any }>({
  form,
  label,
  name,
  className,
}: BooleanSwitchFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            'flex items-center justify-evenly space-y-0.5 rounded-lg border p-3 shadow-sm',
            className,
          )}
        >
          <FormLabel className="w-32">{label}</FormLabel>

          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
