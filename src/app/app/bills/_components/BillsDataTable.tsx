'use client'

import { useState } from 'react'

import { DataTableWithFilter } from '@/components/data-table/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StatusBill } from '@/enums/StatusBill'
import { useDataTable } from '@/hooks/useDataTable'
import { formatCurrency } from '@/lib/formatCurrency'
import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  Row,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'

import { Bill } from '../types'
import { BillDetails } from './BillDetails'
import { PayBill } from './DialogPayBill'

type BillsDataTableProps = {
  data: Bill[]
}

const customSortFn = (rowA: Row<Bill>, rowB: Row<Bill>, columnId: string) => {
  if (columnId === 'status') {
    const statusA = rowA.getValue('status')
    const statusB = rowB.getValue('status')

    const priorities: { [key: string]: number } = {
      LATE: 1,
      OPEN: 2,
      CLOSED: 3,
      PAID: 4,
    }

    const priorityA = priorities[statusA as string]
    const priorityB = priorities[statusB as string]

    return priorityA - priorityB
  }

  return Number(rowA.getValue(columnId)) - Number(rowB.getValue(columnId))
}

export function BillsDataTable({ data }: BillsDataTableProps) {
  const [seeDetailsDialogOpen, setSeeDetailsDialogOpen] = useState(false)
  const [payBillDialogOpen, setPayBillDialogOpen] = useState(false)

  const columns: ColumnDef<Bill>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todos"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const status: string = row.getValue('status')

        const statusVariant: 'secondary' | 'default' | 'destructive' | 'paid' =
          status === StatusBill.OPEN
            ? 'default'
            : status === StatusBill.LATE
              ? 'destructive'
              : status === StatusBill.CLOSED
                ? 'secondary'
                : 'paid'

        return (
          <Badge variant={statusVariant} className="capitalize">
            {status === StatusBill.OPEN
              ? 'Aberta'
              : status === StatusBill.LATE
                ? 'Atrasada'
                : status === StatusBill.CLOSED
                  ? 'Fechada'
                  : 'Paga'}
          </Badge>
        )
      },
      sortingFn: customSortFn,
    },
    {
      accessorKey: 'description',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Descrição
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue('description')}</div>,
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Valor da fatura
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'))

        const formatted =
          amount < 0
            ? `- ${formatCurrency(Math.abs(amount))}`
            : formatCurrency(amount)

        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: 'closingDate',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Data de fechamento
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="font-medium">
            {new Date(row.getValue('closingDate')).toLocaleDateString('pt-BR')}
          </div>
        )
      },
    },
    {
      accessorKey: 'dueDate',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Data de vencimento
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="font-medium">
            {new Date(row.getValue('dueDate')).toLocaleDateString('pt-BR')}
          </div>
        )
      },
    },

    {
      accessorKey: 'cardId',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Cartão
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue('cardId')}</div>
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const bill = row.original

        return (
          <Dialog
            open={seeDetailsDialogOpen || payBillDialogOpen}
            onOpenChange={
              seeDetailsDialogOpen
                ? setSeeDetailsDialogOpen
                : setPayBillDialogOpen
            }
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(bill.id)}
                >
                  Copiar ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSeeDetailsDialogOpen(true)}>
                  Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPayBillDialogOpen(true)}>
                  Marcar como paga
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {seeDetailsDialogOpen && <BillDetails bill={bill} />}
            {payBillDialogOpen && <PayBill bill={bill} />}
          </Dialog>
        )
      },
    },
  ]

  const table = useDataTable({
    data,
    columns,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
  })

  const columnTranslations = {
    status: 'Status',
    description: 'Descrição',
    amount: 'Valor da fatura',
    dueDate: 'Data de vencimento',
    cardId: 'Cartão',
  }

  return (
    <div className="w-full">
      <DataTableWithFilter<Bill>
        table={table}
        columnTranslations={columnTranslations}
        columns={columns}
        showFilter={false}
      />
    </div>
  )
}
