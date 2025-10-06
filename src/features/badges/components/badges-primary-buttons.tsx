"use client"

import { Button } from '@/components/ui/button'
import { Trophy } from 'lucide-react'
import Link from 'next/link'

export function BadgesPrimaryButtons() {
  return (
    <div className='flex gap-2'>
      <Link href="/admin/badges/create" className='flex items-center gap-2'>
        <Button className='space-x-1'>
          <span>Crear insignia</span> <Trophy size={18} />
        </Button>
      </Link>
    </div>
  )
}
