"use client"

import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function UsersPrimaryButtons() {
  return (
    <div className='flex gap-2'>
      <Link href="/admin/users/create" className='flex items-center gap-2'>
        <Button className='space-x-1'>
          <span>Crear usuario</span> <UserPlus size={18} />
        </Button>
      </Link>
    </div>
  )
}
