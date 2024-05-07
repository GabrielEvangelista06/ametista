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
import { CardFlagsDescriptions } from '@/enums/CardFlags'
import { cardSchema } from '@/validators/cardSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { BankInfo } from '../../bank-accounts/types'
import { BankAccountSelect } from '../../transactions/_components/BankAccountSelect'
import { upsertCard } from '../actions'

type CardSheetProps = {
  children: ReactNode
  dataBankInfos: BankInfo[]
}

export function CardUpsertSheet({ children, dataBankInfos }: CardSheetProps) {
  const ref = useRef<HTMLDivElement>(null)

  const router = useRouter()

  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      description: '',
      flag: '',
      bankInfo: '',
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    const response = await upsertCard(data)

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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do cartão</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Descrição que deseja para identificar o cartão"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ponto/virgula somente para separar centavos"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="flag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bandeira</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a bandeira" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(CardFlagsDescriptions).map(
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

            <FormField
              control={form.control}
              name="closingDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dia do fechamento</FormLabel>
                  <FormControl>
                    <Input placeholder="Dia que o cartão vira" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dia do vencimento</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Dia que fatura do cartão vence"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <BankAccountSelect
              form={form}
              label="Conta"
              name="bankInfo"
              data={dataBankInfos}
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
