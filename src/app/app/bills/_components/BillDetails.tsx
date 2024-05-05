import { useEffect, useState } from 'react'

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/formatCurrency'
import { format } from 'date-fns'
import pt from 'date-fns/locale/pt'

import { Transaction } from '../../transactions/_components/types'
import { getBillTransactions } from '../actions'
import { Bill } from '../types'

type BillDetailsProps = {
  bill: Bill
}

export function BillDetails({ bill }: BillDetailsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  async function getTransactionsByBillId() {
    const transactions = await getBillTransactions(bill.id)
    setTransactions(transactions as Transaction[])
  }
  useEffect(() => {
    getTransactionsByBillId()
  }, [])

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Gastos da fatura</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-3">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {transaction.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(transaction.date), 'PPP', {
                    locale: pt,
                  })}
                  {''} - {transaction.category}
                </p>
              </div>
              <div className={`ml-auto font-medium`}>
                <span>{formatCurrency(transaction.amount)}</span>
              </div>
            </div>
          ))
        ) : (
          <p>Não há gastos para essa fatura.</p>
        )}
      </div>
    </DialogContent>
  )
}
