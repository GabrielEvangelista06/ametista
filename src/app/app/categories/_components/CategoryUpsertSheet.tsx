'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, useRef } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { toast } from '@/components/ui/use-toast'
import { CategoryType, CategoryTypeDescriptions } from '@/enums/CategoryType'
import { categorySchema } from '@/validators/categorySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { upsertCategory } from '../actions'

type CardSheetProps = {
  children: ReactNode
}

export function CategoryUpsertSheet({ children }: CardSheetProps) {
  const ref = useRef<HTMLDivElement>(null)

  const router = useRouter()

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: CategoryType.EXPENSE,
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    const response = await upsertCategory(data)

    if (response.error) {
      return toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
    }

    router.refresh()

    ref.current?.click()

    toast({
      title: response.title,
      description: response.message,
    })
  })

  return (
    <Sheet>
      <SheetTrigger className="w-full" asChild>
        <div ref={ref}>{children}</div>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <SheetHeader>
              <SheetTitle>Criar Cartão</SheetTitle>
            </SheetHeader>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da categoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo da categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(CategoryTypeDescriptions).map(
                        ([value, description]) => (
                          <SelectItem key={value} value={value}>
                            {description}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="mt-auto">
              <Button type="submit">Criar</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
