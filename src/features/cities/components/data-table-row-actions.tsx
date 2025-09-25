"use client"

import { type Row } from '@tanstack/react-table'
import { Ellipsis, Trash2, UserPen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { useCities } from './cities-provider'
import { City } from '@/types/city'

type DataTableRowActionsProps = {
  readonly row: Row<City>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useCities()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex data-[state=open]:bg-muted p-0 w-8 h-8'
        >
          <Ellipsis className='w-4 h-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <Link href={`/admin/cities/${row.original.id}`}>
          <DropdownMenuItem>
            Editar
            <DropdownMenuShortcut>
              <UserPen size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('delete')
          }}
          className='text-red-500!'
        >
          Eliminar
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
