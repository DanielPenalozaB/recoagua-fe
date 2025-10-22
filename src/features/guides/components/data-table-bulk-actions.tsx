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
import { Challenge } from '@/types/challenge'
import { GuidesMultiDeleteDialog } from './guides-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  readonly table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    const selectedUsers = selectedRows.map((row) => row.original as Challenge)
    toast.promise(sleep(2000), {
      loading: `${status === 'active' ? 'Activando' : 'Desactivando'} guías...`,
      success: () => {
        table.resetRowSelection()
        return `${status === 'active' ? 'Activado' : 'Desactivado'} ${selectedUsers.length} guía${selectedUsers.length > 1 ? 's' : ''}`
      },
      error: `Error ${status === 'active' ? 'activando' : 'desactivando'} guías`,
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='guía'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
              aria-label='Activar guías seleccionados'
              title='Activar guías seleccionados'
            >
              <UserCheck />
              <span className='sr-only'>Activar guías seleccionados</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Activar guías seleccionados</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
              aria-label='Desactivar guías seleccionados'
              title='Desactivar guías seleccionados'
            >
              <UserX />
              <span className='sr-only'>Desactivar guías seleccionados</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Desactivar guías seleccionados</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Eliminar guías seleccionados'
              title='Eliminar guías seleccionados'
            >
              <Trash2 />
              <span className='sr-only'>Eliminar guías seleccionados</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Eliminar guías seleccionados</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <GuidesMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
