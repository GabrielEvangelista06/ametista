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
import { BankInfoType } from '@/enums/BankInfoType'
import { bankInfoSchema } from '@/validators/bankAccountSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { upsertBankInfo } from '../actions'

type BankAccountUpsertSheetProps = {
  children: ReactNode
}

export function BankAccountUpsertSheet({
  children,
}: BankAccountUpsertSheetProps) {
  const ref = useRef<HTMLDivElement>(null)

  const router = useRouter()

  const form = useForm<z.infer<typeof bankInfoSchema>>({
    resolver: zodResolver(bankInfoSchema),
    defaultValues: {
      name: '',
      type: '',
      currentBalance: 0,
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    const response = await upsertBankInfo(data)

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
      <SheetContent className="max-h-screen overflow-y-auto">
        <Form {...form}>
          <form onSubmit={onSubmit} className="min-h-screen space-y-4">
            <SheetHeader>
              <SheetTitle>Criar Conta</SheetTitle>
            </SheetHeader>

            <FormField
              control={form.control}
              name="currentBalance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saldo atual</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Saldo atual da conta"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome que deseja para identificar a conta"
                      {...field}
                    />
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
                        <SelectValue placeholder="Selecione o tipo da conta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={BankInfoType.CHECKING_ACCOUNT}>
                        Conta corrente
                      </SelectItem>
                      <SelectItem value={BankInfoType.SAVINGS_ACCOUNT}>
                        Conta poupança
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="mt-auto">
              <Button type="submit">Adicionar</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
