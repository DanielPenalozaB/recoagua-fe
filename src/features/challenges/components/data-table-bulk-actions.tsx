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
import { ChallengesMultiDeleteDialog } from './challenges-multi-delete-dialog'

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
      loading: `${status === 'active' ? 'Activando' : 'Desactivando'} retos...`,
      success: () => {
        table.resetRowSelection()
        return `${status === 'active' ? 'Activado' : 'Desactivado'} ${selectedUsers.length} reto${selectedUsers.length > 1 ? 's' : ''}`
      },
      error: `Error ${status === 'active' ? 'activando' : 'desactivando'} retos`,
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='reto'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
              aria-label='Activar retos seleccionados'
              title='Activar retos seleccionados'
            >
              <UserCheck />
              <span className='sr-only'>Activar retos seleccionados</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Activar retos seleccionados</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
              aria-label='Desactivar retos seleccionados'
              title='Desactivar retos seleccionados'
            >
              <UserX />
              <span className='sr-only'>Desactivar retos seleccionados</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Desactivar retos seleccionados</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Eliminar retos seleccionados'
              title='Eliminar retos seleccionados'
            >
              <Trash2 />
              <span className='sr-only'>Eliminar retos seleccionados</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Eliminar retos seleccionados</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <ChallengesMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
