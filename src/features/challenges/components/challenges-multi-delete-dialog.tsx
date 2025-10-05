'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

type ChallengesMultiDeleteDialogProps<TData> = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly table: Table<TData>
}

const CONFIRM_WORD = 'DELETE'

export function ChallengesMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: ChallengesMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState('')

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Por favor, escriba "${CONFIRM_WORD}" para confirmar.`)
      return
    }

    onOpenChange(false)

    toast.promise(sleep(2000), {
      loading: 'Eliminando retos...',
      success: () => {
        table.resetRowSelection()
        return `Eliminar ${selectedRows.length} ${
          selectedRows.length > 1 ? 'retos' : 'reto'
        }`
      },
      error: 'Error',
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='inline-block stroke-destructive me-1'
            size={18}
          />{' '}
          Eliminar {selectedRows.length}{' '}
          {selectedRows.length > 1 ? 'retos' : 'reto'}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Estas seguro de eliminar {selectedRows.length} retos? <br />
            Esta acción no se puede deshacer.
          </p>

          <Label className='flex flex-col items-start gap-1.5 my-4'>
            <span className=''>Confirma escribiendo "{CONFIRM_WORD}":</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Escribe "${CONFIRM_WORD}" para confirmar.`}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Cuidado!</AlertTitle>
            <AlertDescription>
              Por favor sé precavido, esta acción es irreversible.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Eliminar'
      destructive
    />
  )
}
