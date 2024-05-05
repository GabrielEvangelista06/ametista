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
import { CategoryType, CategoryTypeDescriptions } from '@/enums/CategoryType'
import { useDataTable } from '@/hooks/useDataTable'
import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'

import { deleteCategory } from '../actions'
import { Category } from '../types'
import { EditCategory } from './EditCategory'

type CardsDataTableProps = {
  data: Category[]
}

export function CategoriesDataTable({ data }: CardsDataTableProps) {
  const router = useRouter()

  const handleDeleteCategory = async (category: Category) => {
    const response = await deleteCategory({ id: category.id })

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

  const columns: ColumnDef<Category>[] = [
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
      accessorKey: 'categoryType',
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
          {
            CategoryTypeDescriptions[
              row.getValue('categoryType') as CategoryType
            ]
          }
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const category = row.original

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
                  onClick={() => navigator.clipboard.writeText(category.id)}
                >
                  Copiar ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteCategory(category)}
                >
                  Excluir
                </DropdownMenuItem>
                <SheetTrigger asChild>
                  <DropdownMenuItem>Editar</DropdownMenuItem>
                </SheetTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <EditCategory category={category} />
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
    categoryType: 'Tipo',
  }

  return (
    <div className="w-full">
      <DataTableWithFilter<Category>
        table={table}
        columnTranslations={columnTranslations}
        columns={columns}
        showFilter={false}
      />
    </div>
  )
}
