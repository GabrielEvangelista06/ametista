import { ColumnDef, Table } from '@tanstack/react-table'

import { Input } from '../ui/input'
import { DataTableContent } from './DataTableContent'
import { DataTableFooter } from './DataTableFooter'
import { DataTableSelectColumnVisibility } from './DataTableSelectColumnVisibility'

type DataTableWithFilterProps<T> = {
  table: Table<T>
  columnTranslations: Record<string, string>
  columns: ColumnDef<T>[]
  showFilter?: boolean
}

export function DataTableWithFilter<T>({
  table,
  columnTranslations,
  columns,
  showFilter = false,
}: DataTableWithFilterProps<T>) {
  return (
    <div>
      <div className="flex items-center py-4">
        {showFilter && (
          <Input
            placeholder="Filtrar por descrição..."
            value={
              (table.getColumn('description')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('description')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        <DataTableSelectColumnVisibility<T>
          table={table}
          columnTranslations={columnTranslations}
        />
      </div>
      <DataTableContent table={table} columns={columns} />
      <DataTableFooter table={table} />
    </div>
  )
}
