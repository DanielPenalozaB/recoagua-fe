"use client"

import { Button } from '@/components/ui/button'
import { Target } from 'lucide-react'
import Link from 'next/link'

export function ChallengesPrimaryButtons() {
  return (
    <div className='flex gap-2'>
      <Link href="/admin/challenges/create" className='flex items-center gap-2'>
        <Button className='space-x-1'>
          <span>Crear reto</span> <Target size={18} />
        </Button>
      </Link>
    </div>
  )
}
