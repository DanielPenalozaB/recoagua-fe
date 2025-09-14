"use client"

import { useEffect, useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { roles } from '../data/data'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { usersColumns as columns } from './users-columns'
import { User } from '@/types/user'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { ClientOnly } from '@/components/layout/client-only'
import { UseDataTableReturn } from '@/hooks/use-data-table'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    className: string
  }
}

type DataTableProps = {
  readonly data: User[]
  readonly tableState: UseDataTableReturn<any>
  readonly isLoading: boolean
  readonly error: Error | null
  readonly totalCount: number
  readonly pageCount: number
}

export function UsersTable({
  data,
  tableState,
  isLoading,
  error,
  totalCount,
  pageCount
}: DataTableProps) {
  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: tableState.pagination,
      rowSelection,
      columnFilters: tableState.columnFilters,
      columnVisibility,
      globalFilter: tableState.globalFilter,
    },
    enableRowSelection: true,
    onPaginationChange: tableState.onPaginationChange,
    onColumnFiltersChange: tableState.onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: tableState.onGlobalFilterChange,
    getCoreRowModel: getCoreRowModel(),
    // Server-side processing
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    // Provide server-side totals
    pageCount,
    rowCount: totalCount,
  })

  // Reset to page 1 if current page exceeds available pages
  useEffect(() => {
    if (pageCount > 0 && tableState.pagination.pageIndex >= pageCount) {
      tableState.setPage(1)
    }
  }, [pageCount, tableState])

  if (error) {
    return (
      <div className="flex justify-center items-center h-24 text-destructive">
        Error loading users: {error.message}
      </div>
    )
  }

  return (
    <div className='space-y-4 max-sm:has-[div[role="toolbar"]]:mb-16'>
      <ClientOnly
        fallback={
          <div className="flex justify-between items-center">
            <div className="flex flex-1 items-center space-x-2">
              <div className="bg-muted rounded w-[250px] h-8 animate-pulse" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-muted rounded w-[100px] h-8 animate-pulse" />
              <div className="bg-muted rounded w-[100px] h-8 animate-pulse" />
            </div>
          </div>
        }
      >
        <DataTableToolbar
          table={table}
          searchPlaceholder='Filtrar usuarios...'
          searchKey='name'
          filters={[
            {
              columnId: 'status',
              title: 'Estado',
              options: [
                { label: 'Activo', value: 'active' },
                { label: 'Inactivo', value: 'inactive' },
                { label: 'Pendiente', value: 'pending' },
              ],
            },
            {
              columnId: 'role',
              title: 'Rol',
              options: roles.map((role) => ({ ...role })),
            },
          ]}
        />
      </ClientOnly>
      <div className='border rounded-md overflow-hidden'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        'bg-background group-data-[state=selected]/row:bg-muted group-hover/row:bg-muted',
                        header.column.columnDef.meta?.className ?? ''
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading state
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Cargando usuarios...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'bg-background group-data-[state=selected]/row:bg-muted group-hover/row:bg-muted',
                        cell.column.columnDef.meta?.className ?? ''
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ClientOnly
        fallback={
          <div className="flex justify-between items-center px-2">
            <div className="bg-muted rounded w-[200px] h-8 animate-pulse" />
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="bg-muted rounded w-[100px] h-8 animate-pulse" />
              <div className="bg-muted rounded w-[150px] h-8 animate-pulse" />
            </div>
          </div>
        }
      >
        <DataTablePagination table={table} />
      </ClientOnly>
      <ClientOnly>
        <DataTableBulkActions table={table} />
      </ClientOnly>
    </div>
  )
}