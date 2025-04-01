import { Button } from '@/components/ui/button'
import { Table } from '@tanstack/react-table'

type DataTableFooterProps<T> = {
  table: Table<T>
}

export function DataTableFooter<T>({ table }: DataTableFooterProps<T>) {
  return (
    <div
      className={`flex items-center justify-end space-x-2 2xl:py-4 ${table.getFilteredRowModel().rows.length > 10 ? 'py-0 pt-1' : 'py-4'}`}
    >
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} de{' '}
        {table.getFilteredRowModel().rows.length} linhas(s) selecionadas.
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}
