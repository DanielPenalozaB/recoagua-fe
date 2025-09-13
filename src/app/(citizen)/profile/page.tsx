'use client'

import Profile from '@/components/citizen/profile/profile'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  return (
    <div className='flex flex-col gap-6 mx-auto p-6 container'>
      <div className='flex flex-col gap-0.5'>
        <h1 className='font-bold text-2xl md:text-3xl tracking-tight'>
          Perfil
        </h1>
        <p className='text-muted-foreground'>
          Gestiona tu perfil y visualiza tus estadísticas.
        </p>
      </div>
      <Separator />
      <Profile />
    </div>
  )
}
