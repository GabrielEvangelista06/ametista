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
import { BankInfoType } from '@/enums/BankInfoType'
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

import { deleteBankInfo } from '../actions'
import { BankInfo } from '../types'
import { EditBankAccountSheet } from './EditBankAccountSheet'

type BankAccountsDataTableProps = {
  data: BankInfo[]
}

export function BankAccountsDataTable({ data }: BankAccountsDataTableProps) {
  const router = useRouter()

  const handleDeleteBankInfo = async (bankInfo: BankInfo) => {
    const response = await deleteBankInfo({ id: bankInfo.id })

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

  const columns: ColumnDef<BankInfo>[] = [
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
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nome
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'currentBalance',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Saldo
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('currentBalance'))

        const formatted =
          amount < 0
            ? `- ${formatCurrency(Math.abs(amount))}`
            : formatCurrency(amount)

        return <div className="font-medium">{formatted}</div>
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
        <div className="capitalize">
          {row.getValue('type') === BankInfoType.CHECKING_ACCOUNT
            ? 'Conta corrente'
            : 'Conta poupança'}
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const bankInfo = row.original

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
                  onClick={() => navigator.clipboard.writeText(bankInfo.id)}
                >
                  Copiar ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteBankInfo(bankInfo)}
                >
                  Excluir
                </DropdownMenuItem>
                <SheetTrigger asChild>
                  <DropdownMenuItem>Editar</DropdownMenuItem>
                </SheetTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <EditBankAccountSheet bankInfo={bankInfo} />
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
      <DataTableWithFilter<BankInfo>
        table={table}
        columnTranslations={columnTranslations}
        columns={columns}
        showFilter={false}
      />
    </div>
  )
}
