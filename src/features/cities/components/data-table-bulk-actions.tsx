"use client"

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, UserX, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { City } from '@/types/city'
import { CitiesMultiDeleteDialog } from './cities-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  readonly table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    const selectedUsers = selectedRows.map((row) => row.original as City)
    toast.promise(sleep(2000), {
      loading: `${status === 'active' ? 'Activando' : 'Desactivando'} ciudades...`,
      success: () => {
        table.resetRowSelection()
        return `${status === 'active' ? 'Activado' : 'Desactivado'} ${selectedUsers.length} ciudad${selectedUsers.length > 1 ? 's' : ''}`
      },
      error: `Error ${status === 'active' ? 'activando' : 'desactivando'} ciudades`,
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='ciudad'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
              aria-label='Activar ciudades seleccionados'
              title='Activar ciudades seleccionados'
            >
              <UserCheck />
              <span className='sr-only'>Activar ciudades seleccionados</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Activar ciudades seleccionados</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
              aria-label='Desactivar ciudades seleccionados'
              title='Desactivar ciudades seleccionados'
            >
              <UserX />
              <span className='sr-only'>Desactivar ciudades seleccionados</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Desactivar ciudades seleccionados</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Eliminar ciudades seleccionados'
              title='Eliminar ciudades seleccionados'
            >
              <Trash2 />
              <span className='sr-only'>Eliminar ciudades seleccionados</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Eliminar ciudades seleccionados</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <CitiesMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
