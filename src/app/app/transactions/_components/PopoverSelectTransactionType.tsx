'use client'

import { useRef } from 'react'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  ArrowLeftRightIcon,
  CreditCardIcon,
  HandCoinsIcon,
  TrendingDownIcon,
} from 'lucide-react'

import {
  CardExpenseUpsertSheet,
  ExpenseUpsertSheet,
  IncomeUpsertSheet,
  TransferUpsertSheet,
} from './TransactionsUpsertsSheet'
import { PopoverSelectTransactionTypeProps } from './types'

export function PopoverSelectTransactionType({
  children,
  dataBankInfos,
  dataCategories,
  dataCards,
}: PopoverSelectTransactionTypeProps) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div ref={ref}>{children}</div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Tipo</h4>
            <p className="text-sm text-muted-foreground">
              Escolha o tipo de transação que deseja criar.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <HandCoinsIcon />
              <IncomeUpsertSheet
                dataBankInfos={dataBankInfos}
                dataCategories={dataCategories}
              >
                <Button variant="outline" className="w-full">
                  Receita
                </Button>
              </IncomeUpsertSheet>
            </div>
            <div className="flex items-center gap-4">
              <TrendingDownIcon />
              <ExpenseUpsertSheet
                dataBankInfos={dataBankInfos}
                dataCategories={dataCategories}
              >
                <Button variant="outline" className="w-full">
                  Despesa
                </Button>
              </ExpenseUpsertSheet>
            </div>
            <div className="flex items-center gap-4">
              <CreditCardIcon />
              <CardExpenseUpsertSheet
                dataCategories={dataCategories}
                dataCards={dataCards}
              >
                <Button variant="outline" className="w-full">
                  Despesa de cartão
                </Button>
              </CardExpenseUpsertSheet>
            </div>
            <div className="flex items-center gap-4">
              <ArrowLeftRightIcon />
              <TransferUpsertSheet
                dataBankInfos={dataBankInfos}
                dataCategories={dataCategories}
              >
                <Button variant="outline" className="w-full">
                  Transferência
                </Button>
              </TransferUpsertSheet>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
