'use client'

import { useRouter } from 'next/navigation'
import { useRef } from 'react'
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
import { cardExpenseSchema } from '@/validators/cardExpenseSchema'
import { incomeSchema } from '@/validators/incomeSchema'
import { transferSchema } from '@/validators/transferSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDownIcon } from 'lucide-react'

import { upsertIncomeTransaction } from '../actions'
import { BankAccountSelect } from './BankAccountSelect'
import { BooleanSwitchField } from './BooleanSwitchField'
import { CategorySelect } from './CategorySelect'
import { DateSelect } from './DataSelect'
import { GenericTransactionFormField } from './GenericTransactionFormField'
import { PopoverMoreDetails } from './PopoverMoreDetails'
import {
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
      date: new Date(),
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await upsertIncomeTransaction(data)

    router.refresh()

    ref.current?.click()

    toast({
      title: 'Receita adicionada',
      description: 'Receita adicionada com sucesso',
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
              <SheetTitle>Adicionar Receita</SheetTitle>
            </SheetHeader>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da receita</FormLabel>
                  <FormControl>
                    <Input placeholder="0,00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <BooleanSwitchField
              form={form}
              label="Pago"
              name="isPaid"
              className="h-10 w-1/2"
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Adicione a descrição" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CategorySelect form={form} categories={dataCategories || []} />

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

  const form = useForm<InputDefault>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      category: '',
      date: new Date(),
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)
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
              <SheetTitle>Adicionar Despesa</SheetTitle>
            </SheetHeader>

            <GenericTransactionFormField
              form={form}
              name="amount"
              label="Valor da despesa"
              placeholder="0,00"
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

            <CategorySelect form={form} categories={dataCategories || []} />

            <BankAccountSelect
              name="bankAccount"
              label="Conta"
              form={form}
              data={dataBankInfos || []}
            />

            <DateSelect form={form} />

            <PopoverMoreDetails>
              <BooleanSwitchField
                form={form}
                label="Despesa fixa"
                name="isFixed"
              />

              <BooleanSwitchField form={form} label="Repetir" name="repeat" />
            </PopoverMoreDetails>
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
}: TransactionUpsertSheetProps) {
  const ref = useRef<HTMLDivElement>(null)

  const form = useForm<InputCardExpense>({
    resolver: zodResolver(cardExpenseSchema),
    defaultValues: {
      date: new Date(),
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)
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
              <SheetTitle>Adicionar Despesa do cartão</SheetTitle>
            </SheetHeader>

            <GenericTransactionFormField
              form={form}
              name="amount"
              label="Valor da despesa"
              placeholder="0,00"
            />

            <GenericTransactionFormField
              form={form}
              name="description"
              label="Descrição"
              placeholder="Adicione a descrição"
            />

            <CategorySelect form={form} categories={dataCategories || []} />

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
                        <SelectItem value="est">
                          Eastern Standard Time (EST)
                        </SelectItem>
                        <SelectItem value="cst">
                          Central Standard Time (CST)
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billing"
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
                        <SelectItem value="est">
                          Eastern Standard Time (EST)
                        </SelectItem>
                        <SelectItem value="cst">
                          Central Standard Time (CST)
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DateSelect form={form} />

            <PopoverMoreDetails>
              <BooleanSwitchField
                form={form}
                label="Parcelado"
                name="isInstallment"
              />

              <BooleanSwitchField
                form={form}
                label="Despesa fixa"
                name="fixed"
              />
            </PopoverMoreDetails>

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
  dataCategories,
}: TransactionUpsertSheetProps) {
  const ref = useRef<HTMLDivElement>(null)

  const form = useForm<InputTransfer>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      category: 'en',
      date: new Date(),
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)
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
              <SheetTitle>Adicionar Transferência</SheetTitle>
            </SheetHeader>

            <GenericTransactionFormField
              form={form}
              name="amount"
              label="Valor da transferência"
              placeholder="0,00"
            />

            <GenericTransactionFormField
              form={form}
              name="description"
              label="Descrição"
              placeholder="Adicione a descrição"
            />

            <BankAccountSelect
              name="sourceAccount"
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

            <CategorySelect form={form} categories={dataCategories || []} />

            <DateSelect form={form} />

            <PopoverMoreDetails>
              <BooleanSwitchField
                form={form}
                label="Transferência fixa"
                name="isFixed"
              />
            </PopoverMoreDetails>

            <SheetFooter className="mt-auto">
              <Button type="submit">Adicionar</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
