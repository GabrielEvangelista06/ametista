'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'
import { formatCurrency } from '@/lib/formatCurrency'
import { payBillSchema } from '@/validators/payBillSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { getUserBankInfos } from '../../bank-accounts/actions'
import { BankInfo } from '../../bank-accounts/types'
import { BankAccountSelect } from '../../transactions/_components/BankAccountSelect'
import { DateSelect } from '../../transactions/_components/DateSelect'
import { markBillAsPaid } from '../actions'
import { Bill } from '../types'

type PayBillProps = {
  bill: Bill
}

export function PayBill({ bill }: PayBillProps) {
  const router = useRouter()

  const form = useForm<z.infer<typeof payBillSchema>>({
    resolver: zodResolver(payBillSchema),
    defaultValues: {
      billId: bill.id,
      date: new Date(),
      bankAccount: '',
    },
  })

  const [bankInfos, setBankInfos] = useState<BankInfo[]>([])

  useEffect(() => {
    const fetchBankInfos = async () => {
      const response = await getUserBankInfos()

      setBankInfos(response)
    }

    fetchBankInfos()
  }, [])

  const onSubmit = form.handleSubmit(async (data) => {
    const response = await markBillAsPaid(data)

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
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Pagar fatura</DialogTitle>
          </DialogHeader>
          <div className="flex gap-10">
            <div className="flex flex-col">
              <p>Valor da fatura</p>
              <p className="text-sm font-thin">
                {bill.amount < 0
                  ? `- ${formatCurrency(Math.abs(bill.amount))}`
                  : formatCurrency(bill.amount)}
              </p>
            </div>

            <div className="flex flex-col">
              <p>Fatura</p>
              <p className="text-sm font-thin">
                {bill.dueDate.toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <DateSelect form label="Data que a fatura foi paga" />
          <BankAccountSelect
            name="bankAccount"
            label="De qual conta deseja pagar?"
            form={form}
            data={bankInfos || []}
          />

          <DialogFooter>
            <Button type="submit">Pagar</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
