'use client'

import { useRouter } from 'next/navigation'

import { DataTableWithFilter } from '@/components/data-table/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import { toast } from '@/components/ui/use-toast'
import { Status } from '@/enums/Status'
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

import { deleteTransaction, updateTransactionStatus } from '../actions'
import {
  EditCardExpenseSheet,
  EditExpenseSheet,
  EditIncomeTransaction,
  EditTransferSheet,
} from './TransactionsEditSheet'
import { Transaction, TransactionsDataTableProps } from './types'

const customSortFn = (
  rowA: Row<Transaction>,
  rowB: Row<Transaction>,
  columnId: string,
) => {
  if (columnId === 'status') {
    const statusA = rowA.getValue('status')
    const statusB = rowB.getValue('status')

    const priorities: { [key: string]: number } = {
      LATE: 1,
      PENDING: 2,
      COMPLETED: 3,
    }

    const priorityA = priorities[statusA as string]
    const priorityB = priorities[statusB as string]

    return priorityA - priorityB
  }

  return Number(rowA.getValue(columnId)) - Number(rowB.getValue(columnId))
}

export function TransactionsDataTable({
  data,
  dataBankInfos,
  dataCards,
}: TransactionsDataTableProps) {
  const router = useRouter()

  const handleDeleteTransaction = async (transaction: Transaction) => {
    const response = await deleteTransaction({ id: transaction.id })

    if (response.error) {
      return toast({
        title: 'Erro',
        description: response.error,
        variant: 'destructive',
      })
    }

    router.refresh()

    toast({
      title: 'Transação excluída',
      description: response.data,
    })
  }

  const updateTransactionStatusToCompleted = async (
    transaction: Transaction,
  ) => {
    const response = await updateTransactionStatus({
      id: transaction.id,
      status: Status.COMPLETED,
    })

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
  }

  const columns: ColumnDef<Transaction>[] = [
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

        const statusVariant: 'secondary' | 'default' | 'destructive' =
          status === Status.COMPLETED
            ? 'default'
            : status === Status.LATE
              ? 'destructive'
              : 'secondary'

        return (
          <Badge variant={statusVariant} className="capitalize">
            {status === Status.COMPLETED
              ? 'Completo'
              : status === Status.LATE
                ? 'Atrasado'
                : 'Pendente'}
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
            Valor
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'))

        const formatted = formatCurrency(amount)

        const displayAmount =
          row.getValue('type') === 'Despesa' ||
          row.getValue('type') === 'Despesa de Cartão'
            ? `- ${formatted}`
            : formatted

        return <div className="font-medium">{displayAmount}</div>
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Tipo
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('type')}</div>
      ),
    },
    {
      accessorKey: 'category',
      header: () => <div>Categoria</div>,
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue('category')}</div>
      },
    },
    {
      accessorKey: 'bankInfoInstitution',
      header: () => <div>Conta</div>,
      cell: ({ row }) => {
        return (
          <div className="font-medium">
            {row.getValue('bankInfoInstitution')}
          </div>
        )
      },
    },
    {
      accessorKey: 'date',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Data
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="font-medium">
            {new Date(row.getValue('date')).toLocaleDateString('pt-BR')}
          </div>
        )
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const transaction = row.original

        return (
          <Sheet>
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
                  onClick={() => navigator.clipboard.writeText(transaction.id)}
                >
                  Copiar ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    updateTransactionStatusToCompleted(transaction)
                  }
                >
                  Marcar como completo
                </DropdownMenuItem>
                <SheetTrigger asChild>
                  <DropdownMenuItem>Editar</DropdownMenuItem>
                </SheetTrigger>
                <DropdownMenuItem
                  onClick={() => handleDeleteTransaction(transaction)}
                >
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {transaction.type === 'Receita' && (
              <EditIncomeTransaction
                defaultValue={transaction}
                dataBankInfos={dataBankInfos}
              />
            )}
            {transaction.type === 'Despesa' && (
              <EditExpenseSheet
                defaultValue={transaction}
                dataBankInfos={dataBankInfos}
              />
            )}
            {transaction.type === 'Despesa de Cartão' && (
              <EditCardExpenseSheet
                defaultValue={transaction}
                dataBankInfos={dataBankInfos}
                dataCards={dataCards}
              />
            )}
            {transaction.type === 'Transferência' && (
              <EditTransferSheet
                defaultValue={transaction}
                dataBankInfos={dataBankInfos}
              />
            )}
          </Sheet>
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
    amount: 'Valor',
    type: 'Tipo',
    category: 'Categoria',
    bankInfoInstitution: 'Conta',
    date: 'Data',
    actions: 'Ações',
  }

  return (
    <div className="w-full">
      <DataTableWithFilter<Transaction>
        table={table}
        columnTranslations={columnTranslations}
        columns={columns}
        showFilter={true}
      />
    </div>
  )
}
