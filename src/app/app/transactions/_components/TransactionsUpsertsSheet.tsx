'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectGroup,
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
import { defaultCategories } from '@/constants/defaultCategories'
import { cardExpenseSchema } from '@/validators/cardExpenseSchema'
import { expenseSchema } from '@/validators/expenseSchema'
import { incomeSchema } from '@/validators/incomeSchema'
import { transferSchema } from '@/validators/transferSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDownIcon } from 'lucide-react'
import { z } from 'zod'

import {
  getUserBillsByCardId,
  upsertCardExpenseTransaction,
  upsertExpenseTransaction,
  upsertIncomeTransaction,
  upsertTransferTransaction,
} from '../actions'
import { BankAccountSelect } from './BankAccountSelect'
import { BooleanSwitchField } from './BooleanSwitchField'
import { CategorySelect } from './CategorySelect'
import { DateSelect } from './DateSelect'
import { GenericTransactionFormField } from './GenericTransactionFormField'
import {
  Bill,
  InputCardExpense,
  InputDefault,
  InputTransfer,
  TransactionUpsertSheetProps,
} from './types'

export function IncomeUpsertSheet({
  children,
  dataBankInfos,
  dataCategories,
}: TransactionUpsertSheetProps) {
  const ref = useRef<HTMLDivElement>(null)

  const router = useRouter()

  const form = useForm<InputDefault>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      isPaid: false,
      description: '',
      category: '',
      bankAccount: '',
      isFixed: false,
      date: new Date(),
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    const response = await upsertIncomeTransaction(data)

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

  const allCategories = defaultCategories.concat(dataCategories || [])

  const filteredCategories = allCategories?.filter(
    (category) =>
      category.categoryType === 'income' || category.categoryType === 'all',
  )

  return (
    <Sheet>
      <SheetTrigger className="w-full" asChild>
        <div ref={ref}>{children}</div>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <SheetHeader>
              <SheetTitle>Adicionar Receita</SheetTitle>
            </SheetHeader>

            <GenericTransactionFormField
              form={form}
              name="amount"
              label="Valor da receita"
              placeholder="Ponto/virgula somente para separar centavos"
              type="number"
            />

            <BooleanSwitchField
              form={form}
              label="Recebido"
              name="isPaid"
              className="h-10 w-1/2"
            />

            <GenericTransactionFormField
              form={form}
              name="description"
              label="Descrição"
              placeholder="Adicione a descrição"
            />

            <CategorySelect form={form} categories={filteredCategories || []} />

            <BankAccountSelect
              name="bankAccount"
              label="Conta"
              form={form}
              data={dataBankInfos || []}
            />

            <DateSelect form={form} />

            <SheetFooter className="mt-auto">
              <Button type="submit">Adicionar</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export function ExpenseUpsertSheet({
  children,
  dataBankInfos,
  dataCategories,
}: TransactionUpsertSheetProps) {
  const ref = useRef<HTMLDivElement>(null)

  const router = useRouter()

  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      isPaid: false,
      description: '',
      category: '',
      bankAccount: '',
      isFixed: false,
      date: new Date(),
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    const response = await upsertExpenseTransaction(data)

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

  const allCategories = defaultCategories.concat(dataCategories || [])

  const filteredCategories = allCategories?.filter(
    (category) =>
      category.categoryType === 'expense' || category.categoryType === 'all',
  )

  return (
    <Sheet>
      <SheetTrigger className="w-full" asChild>
        <div ref={ref}>{children}</div>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <SheetHeader>
              <SheetTitle>Adicionar Despesa</SheetTitle>
            </SheetHeader>

            <GenericTransactionFormField
              form={form}
              name="amount"
              label="Valor da despesa"
              placeholder="Ponto/virgula somente para separar centavos"
              type="number"
            />

            <BooleanSwitchField
              form={form}
              label="Pago"
              name="isPaid"
              className="h-10 w-1/2"
            />

            <GenericTransactionFormField
              form={form}
              name="description"
              label="Descrição"
              placeholder="Adicione a descrição"
            />

            <CategorySelect form={form} categories={filteredCategories || []} />

            <BankAccountSelect
              name="bankAccount"
              label="Conta"
              form={form}
              data={dataBankInfos || []}
            />

            <DateSelect form={form} />

            <SheetFooter className="mt-auto">
              <Button type="submit">Adicionar</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export function CardExpenseUpsertSheet({
  children,
  dataCategories,
  dataCards,
}: TransactionUpsertSheetProps) {
  const ref = useRef<HTMLDivElement>(null)

  const form = useForm<InputCardExpense>({
    resolver: zodResolver(cardExpenseSchema),
    defaultValues: {
      description: '',
      category: '',
      card: '',
      bill: '',
      isFixed: false,
      date: new Date(),
    },
  })

  const router = useRouter()

  const onSubmit = form.handleSubmit(async (data) => {
    const response = await upsertCardExpenseTransaction(data)

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

  const allCategories = defaultCategories.concat(dataCategories || [])

  const filteredCategories = allCategories?.filter(
    (category) =>
      category.categoryType === 'expense' || category.categoryType === 'all',
  )

  const [bills, setBillings] = useState<Bill[]>([])

  const selectedCardId = form.watch('card')

  useEffect(() => {
    async function fetchBillings() {
      try {
        const response = await getUserBillsByCardId(selectedCardId)
        setBillings(response || [])
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Erro ao buscar as faturas',
          variant: 'destructive',
        })
      }
    }

    if (selectedCardId) {
      fetchBillings()
    }
  }, [selectedCardId])

  return (
    <Sheet>
      <SheetTrigger className="w-full" asChild>
        <div ref={ref}>{children}</div>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <SheetHeader>
              <SheetTitle>Adicionar Despesa do cartão</SheetTitle>
            </SheetHeader>

            <GenericTransactionFormField
              form={form}
              name="amount"
              label="Valor da despesa"
              placeholder="Ponto/virgula somente para separar centavos"
            />

            <GenericTransactionFormField
              form={form}
              name="description"
              label="Descrição"
              placeholder="Adicione a descrição"
            />

            <CategorySelect form={form} categories={filteredCategories || []} />

            <FormField
              control={form.control}
              name="card"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>Cartão</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Selecione o cartão" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {dataCards && dataCards.length > 0 ? (
                          dataCards.map((card) => (
                            <SelectItem value={card.id} key={card.id}>
                              {card.description}
                            </SelectItem>
                          ))
                        ) : (
                          <p className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                            Não foram encontrados cartões para você.
                          </p>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bill"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>Fatura</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Selecione a fatura" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {bills && bills.length > 0 ? (
                          bills.map((bill) => (
                            <SelectItem value={bill.id} key={bill.id}>
                              {bill.description}
                            </SelectItem>
                          ))
                        ) : (
                          <p className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                            Não foram encontrados faturas para o cartão
                            selecionado.
                          </p>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DateSelect form={form} />

            <SheetFooter className="mt-auto">
              <Button type="submit">Adicionar</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export function TransferUpsertSheet({
  children,
  dataBankInfos,
}: TransactionUpsertSheetProps) {
  const ref = useRef<HTMLDivElement>(null)

  const form = useForm<InputTransfer>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      amount: 0,
      description: '',
      accountId: '',
      destinationAccount: '',
      date: new Date(),
    },
  })

  const router = useRouter()

  const onSubmit = form.handleSubmit(async (data) => {
    const response = await upsertTransferTransaction(data)

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
              <SheetTitle>Adicionar Transferência</SheetTitle>
            </SheetHeader>

            <GenericTransactionFormField
              form={form}
              name="amount"
              label="Valor da transferência"
              placeholder="Ponto/virgula somente para separar centavos"
              type="number"
            />

            <GenericTransactionFormField
              form={form}
              name="description"
              label="Descrição"
              placeholder="Adicione a descrição"
            />

            <BankAccountSelect
              name="accountId"
              form={form}
              label="De conta"
              data={dataBankInfos || []}
            />

            <div className="flex flex-col items-center justify-center">
              <p className="text-sm">Transferir para</p>
              <ChevronDownIcon className="h-5 w-5" />
            </div>

            <BankAccountSelect
              name="destinationAccount"
              form={form}
              label="Para conta"
              data={dataBankInfos || []}
            />

            <DateSelect form={form} />

            <SheetFooter className="mt-auto">
              <Button type="submit">Adicionar</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
