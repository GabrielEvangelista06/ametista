'use client'

import { useRouter } from 'next/navigation'

import { DataTableWithFilter } from '@/components/data-table/DataTable'
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
import { CardFlags, CardFlagsDescriptions } from '@/enums/CardFlags'
import { useDataTable } from '@/hooks/useDataTable'
import { formatCurrency } from '@/lib/formatCurrency'
import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'

import { BankInfo } from '../../bank-accounts/types'
import { deleteCard } from '../actions'
import { Card } from '../types'
import { EditCardSheet } from './EditCardSheet'

type CardsDataTableProps = {
  data: Card[]
  dataBankInfos: BankInfo[]
}

export function CardsDataTable({ data, dataBankInfos }: CardsDataTableProps) {
  const router = useRouter()

  const handleDeleteBankInfo = async (card: Card) => {
    const response = await deleteCard({ id: card.id })

    router.refresh()

    if (response.error) {
      return toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
    }

    toast({
      title: response.title,
      description: response.message,
    })
  }

  const columns: ColumnDef<Card>[] = [
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
      accessorKey: 'limit',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Limite
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('limit'))

        const formatted =
          amount < 0
            ? `- ${formatCurrency(Math.abs(amount))}`
            : formatCurrency(amount)

        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: 'flag',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Bandeira
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="capitalize">
          {CardFlagsDescriptions[row.getValue('flag') as CardFlags]}
        </div>
      ),
    },
    {
      accessorKey: 'closingDay',
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
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('closingDay')}</div>
      ),
    },
    {
      accessorKey: 'dueDay',
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
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('dueDay')}</div>
      ),
    },
    {
      accessorKey: 'bankInfoName',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Conta
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('bankInfoName')}</div>
      ),
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
                <SheetTrigger asChild>
                  <DropdownMenuItem>Editar</DropdownMenuItem>
                </SheetTrigger>
                <DropdownMenuItem
                  onClick={() => handleDeleteBankInfo(transaction)}
                >
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <EditCardSheet card={transaction} dataBankInfos={dataBankInfos} />
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
    name: 'Nome',
    currentBalance: 'Saldo',
    type: 'Tipo',
  }

  return (
    <div className="w-full">
      <DataTableWithFilter<Card>
        table={table}
        columnTranslations={columnTranslations}
        columns={columns}
        showFilter={false}
      />
    </div>
  )
}
