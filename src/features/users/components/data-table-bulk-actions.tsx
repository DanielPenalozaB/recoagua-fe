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
import { UsersMultiDeleteDialog } from './users-multi-delete-dialog'
import { User } from '@/types/user'

type DataTableBulkActionsProps<TData> = {
  readonly table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    toast.promise(sleep(2000), {
      loading: `${status === 'active' ? 'Activando' : 'Desactivando'} usuarios...`,
      success: () => {
        table.resetRowSelection()
        return `${status === 'active' ? 'Activado' : 'Desactivado'} ${selectedUsers.length} usuario${selectedUsers.length > 1 ? 's' : ''}`
      },
      error: `Error ${status === 'active' ? 'activando' : 'desactivando'} usuarios`,
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='usuario'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
              aria-label='Activar usuarios seleccionados'
              title='Activar usuarios seleccionados'
            >
              <UserCheck />
              <span className='sr-only'>Activar usuarios seleccionados</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Activar usuarios seleccionados</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
              aria-label='Desactivar usuarios seleccionados'
              title='Desactivar usuarios seleccionados'
            >
              <UserX />
              <span className='sr-only'>Desactivar usuarios seleccionados</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Desactivar usuarios seleccionados</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Eliminar usuarios seleccionados'
              title='Eliminar usuarios seleccionados'
            >
              <Trash2 />
              <span className='sr-only'>Eliminar usuarios seleccionados</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Eliminar usuarios seleccionados</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <UsersMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
