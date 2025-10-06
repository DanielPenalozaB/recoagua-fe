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
import { Badge } from '@/types/badge'
import { BadgesMultiDeleteDialog } from './badges-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  readonly table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    const selectedUsers = selectedRows.map((row) => row.original as Badge)
    toast.promise(sleep(2000), {
      loading: `${status === 'active' ? 'Activando' : 'Desactivando'} insignias...`,
      success: () => {
        table.resetRowSelection()
        return `${status === 'active' ? 'Activado' : 'Desactivado'} ${selectedUsers.length} insignia${selectedUsers.length > 1 ? 's' : ''}`
      },
      error: `Error ${status === 'active' ? 'activando' : 'desactivando'} insignias`,
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='insignia'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
              aria-label='Activar insignias seleccionados'
              title='Activar insignias seleccionados'
            >
              <UserCheck />
              <span className='sr-only'>Activar insignias seleccionados</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Activar insignias seleccionados</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
              aria-label='Desactivar insignias seleccionados'
              title='Desactivar insignias seleccionados'
            >
              <UserX />
              <span className='sr-only'>Desactivar insignias seleccionados</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Desactivar insignias seleccionados</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Eliminar insignias seleccionados'
              title='Eliminar insignias seleccionados'
            >
              <Trash2 />
              <span className='sr-only'>Eliminar insignias seleccionados</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Eliminar insignias seleccionados</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <BadgesMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
