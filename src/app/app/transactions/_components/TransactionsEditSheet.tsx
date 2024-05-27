'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { toast } from '@/components/ui/use-toast'
import { defaultCategories } from '@/constants/defaultCategories'
import { Status } from '@/enums/Status'
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
import { PopoverMoreDetails } from './PopoverMoreDetails'
import {
  Bill,
  InputCardExpense,
  InputDefault,
  InputTransfer,
  TransactionUpsertSheetProps,
} from './types'

export function EditIncomeTransaction({
  dataBankInfos,
  dataCategories,
  defaultValue,
}: TransactionUpsertSheetProps) {
  const router = useRouter()

  const form = useForm<InputDefault>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      id: defaultValue?.id,
      amount: defaultValue?.amount,
      isPaid: defaultValue?.status === Status.COMPLETED,
      description: defaultValue?.description,
      category: defaultValue?.categoryId || '',
      bankAccount: defaultValue?.bankInfoId || '',
      isFixed: defaultValue?.isFixed,
      date: defaultValue?.date || new Date(),
      repeat: defaultValue?.repeat,
      numberRepetitions: defaultValue?.numberRepetitions || 0,
      repetitionPeriod: defaultValue?.repetitionPeriod || '',
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
    <SheetContent className="overflow-y-auto">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <SheetHeader>
            <SheetTitle>Editar Receita</SheetTitle>
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

          <PopoverMoreDetails>
            <div className="flex flex-col gap-4">
              <BooleanSwitchField
                form={form}
                label="Receita fixa"
                name="isFixed"
              />
            </div>

            <div className="flex flex-col gap-4">
              <Popover>
                <PopoverTrigger>
                  <BooleanSwitchField
                    form={form}
                    label="Repetir"
                    name="repeat"
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <FormField
                    control={form.control}
                    name="numberRepetitions"
                    render={({ field }) => (
                      <FormItem className="ap-1 flex items-center justify-evenly space-y-0.5 rounded-lg border p-3 shadow-sm">
                        <FormLabel className="w-32">Quantidade</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="repetitionPeriod"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-evenly space-y-0.5 rounded-lg border p-3 shadow-sm">
                        <FormLabel className="w-32">Período</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o perí" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MONTHLY">Mensal</SelectItem>
                            <SelectItem value="DAILY">Diário</SelectItem>
                            <SelectItem value="WEEKLY">Semanal</SelectItem>
                            <SelectItem value="YEARLY">Anual</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </PopoverMoreDetails>

          <SheetFooter className="mt-auto">
            <Button type="submit">Salvar Edição</Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetContent>
  )
}

export function EditExpenseSheet({
  dataBankInfos,
  dataCategories,
  defaultValue,
}: TransactionUpsertSheetProps) {
  const router = useRouter()

  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      id: defaultValue?.id,
      amount: defaultValue?.amount,
      isPaid: defaultValue?.status === Status.COMPLETED,
      description: defaultValue?.description,
      category: defaultValue?.categoryId || '',
      bankAccount: defaultValue?.bankInfoId || '',
      date: defaultValue?.date || new Date(),
      isFixed: defaultValue?.isFixed,
      repeat: defaultValue?.repeat,
      numberRepetitions: defaultValue?.numberRepetitions || 0,
      repetitionPeriod: defaultValue?.repetitionPeriod || '',
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
    <SheetContent className="overflow-y-auto">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <SheetHeader>
            <SheetTitle>Editar Despesa</SheetTitle>
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

          <PopoverMoreDetails>
            <div className="flex flex-col gap-4">
              <BooleanSwitchField
                form={form}
                label="Receita fixa"
                name="isFixed"
              />
            </div>

            <div className="flex flex-col gap-4">
              <Popover>
                <PopoverTrigger>
                  <BooleanSwitchField
                    form={form}
                    label="Repetir"
                    name="repeat"
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <FormField
                    control={form.control}
                    name="numberRepetitions"
                    render={({ field }) => (
                      <FormItem className="ap-1 flex items-center justify-evenly space-y-0.5 rounded-lg border p-3 shadow-sm">
                        <FormLabel className="mr-1 w-32">Quantidade</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="repetitionPeriod"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-evenly space-y-0.5 rounded-lg border p-3 shadow-sm">
                        <FormLabel className="w-32">Período</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o perí" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MONTHLY">Mensal</SelectItem>
                            <SelectItem value="DAILY">Diário</SelectItem>
                            <SelectItem value="WEEKLY">Semanal</SelectItem>
                            <SelectItem value="YEARLY">Anual</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </PopoverMoreDetails>

          <SheetFooter className="mt-auto">
            <Button type="submit">Salvar Edição</Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetContent>
  )
}

export function EditCardExpenseSheet({
  dataCategories,
  dataCards,
  defaultValue,
}: TransactionUpsertSheetProps) {
  const form = useForm<InputCardExpense>({
    resolver: zodResolver(cardExpenseSchema),
    defaultValues: {
      id: defaultValue?.id,
      amount: defaultValue?.amount,
      description: defaultValue?.description,
      category: defaultValue?.categoryId || '',
      card: defaultValue?.cardId || '',
      bill: defaultValue?.billId || '',
      date: defaultValue?.date || new Date(),
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
    <SheetContent className="overflow-y-auto">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <SheetHeader>
            <SheetTitle>Editar Despesa do cartão</SheetTitle>
          </SheetHeader>

          <GenericTransactionFormField
            form={form}
            name="amount"
            label="Valor da despesa"
            placeholder="Ponto/virgula somente para separar centavos"
            type="number"
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
            <Button type="submit">Salvar Edição</Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetContent>
  )
}

export function EditTransferSheet({
  dataBankInfos,
  defaultValue,
}: TransactionUpsertSheetProps) {
  const form = useForm<InputTransfer>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      id: defaultValue?.id,
      amount: defaultValue?.amount,
      description: defaultValue?.description,
      accountId: defaultValue?.bankInfoId || '',
      destinationAccount: defaultValue?.destinationBankInfoId || '',
      date: defaultValue?.date,
      repeat: defaultValue?.repeat,
      numberRepetitions: defaultValue?.numberRepetitions || 0,
      repetitionPeriod: defaultValue?.repetitionPeriod || '',
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

    toast({
      title: response.title,
      description: response.message,
    })
  })

  return (
    <SheetContent className="overflow-y-auto">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <SheetHeader>
            <SheetTitle>Editar Transferência</SheetTitle>
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

          <PopoverMoreDetails>
            <div className="flex flex-col gap-4">
              <BooleanSwitchField
                form={form}
                label="Receita fixa"
                name="isFixed"
              />
            </div>

            <div className="flex flex-col gap-4">
              <Popover>
                <PopoverTrigger>
                  <BooleanSwitchField
                    form={form}
                    label="Repetir"
                    name="repeat"
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <FormField
                    control={form.control}
                    name="numberRepetitions"
                    render={({ field }) => (
                      <FormItem className="ap-1 flex items-center justify-evenly space-y-0.5 rounded-lg border p-3 shadow-sm">
                        <FormLabel className="mr-1 w-32">Quantidade</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="repetitionPeriod"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-evenly space-y-0.5 rounded-lg border p-3 shadow-sm">
                        <FormLabel className="w-32">Período</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o perí" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MONTHLY">Mensal</SelectItem>
                            <SelectItem value="DAILY">Diário</SelectItem>
                            <SelectItem value="WEEKLY">Semanal</SelectItem>
                            <SelectItem value="YEARLY">Anual</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </PopoverMoreDetails>

          <SheetFooter className="mt-auto">
            <Button type="submit">Salvar Edição</Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetContent>
  )
}
