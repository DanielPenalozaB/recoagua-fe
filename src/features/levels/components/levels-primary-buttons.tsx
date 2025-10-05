"use client"

import { Button } from '@/components/ui/button'
import { Award } from 'lucide-react'
import Link from 'next/link'

export function LevelsPrimaryButtons() {
  return (
    <div className='flex gap-2'>
      <Link href="/admin/levels/create" className='flex items-center gap-2'>
        <Button className='space-x-1'>
          <span>Crear nivel</span> <Award size={18} />
        </Button>
      </Link>
    </div>
  )
}
