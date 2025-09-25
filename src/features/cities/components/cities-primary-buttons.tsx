"use client"

import { Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CitiesPrimaryButtons() {
  return (
    <div className='flex gap-2'>
      <Link href="/admin/cities/create" className='flex items-center gap-2'>
        <Button className='space-x-1'>
          <span>Crear ciudad</span> <Building2 size={18} />
        </Button>
      </Link>
    </div>
  )
}
