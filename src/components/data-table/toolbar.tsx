"use client"

import { type Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounce } from '../../hooks/use-debounce'
import { DataTableFacetedFilter } from './faceted-filter'
import { DataTableViewOptions } from './view-options'

type DataTableToolbarProps<TData> = {
  readonly table: Table<TData>
  readonly searchPlaceholder?: string
  readonly searchKey?: string
  readonly filters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filtrar...',
  searchKey,
  filters = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 || !!table.getState().globalFilter

  // Get the global filter value once per render to use as a stable dependency.
  const globalFilter = table.getState().globalFilter ?? ''

  const [searchValue, setSearchValue] = useState(globalFilter)
  const debouncedSearchValue = useDebounce(searchValue, 500)

  // This effect is responsible for updating the table's filter state
  // ONLY when the debounced search value changes.
  useEffect(() => {
    table.setGlobalFilter(debouncedSearchValue)
  }, [debouncedSearchValue, table.setGlobalFilter])

  // This effect synchronizes the local input value with the table's global filter.
  // This is essential for external updates, like the reset button.
  // It ONLY depends on `globalFilter` to avoid a loop when the user is typing.
  useEffect(() => {
    setSearchValue(globalFilter)
  }, [globalFilter])

  return (
    <div className='flex justify-between items-center'>
      <div className='flex sm:flex-row flex-col-reverse flex-1 items-start sm:items-center gap-y-2 sm:space-x-2'>
        {searchKey ? (
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className='w-[150px] lg:w-[250px] h-8'
          />
        ) : (
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className='w-[150px] lg:w-[250px] h-8'
          />
        )}
        <div className='flex gap-x-2'>
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId)
            if (!column) return null
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          })}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter('')
            }}
            className='px-2 lg:px-3 h-8'
          >
            Resetear
            <X className='ms-2 w-4 h-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}

