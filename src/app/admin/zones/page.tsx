"use client"

import { Main } from '@/components/layout/main'
import { ProfileDropdown, Separator, SidebarTrigger, ThemeSwitch } from '@/components/ui'
import { ZonesPrimaryButtons, ZonesProvider, ZonesTable } from '@/features/zones'

export default function ZonesPage() {
  return (
    <ZonesProvider>
      <header className="flex justify-between items-center gap-2 h-16 shrink-0">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </div>
        <div className="flex items-center gap-4 pr-2">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </header>
      <Main>
        <div className='flex flex-wrap justify-between items-center space-y-2 mb-2'>
          <div>
            <h2 className='font-bold text-2xl tracking-tight'>Zonas</h2>
            <p className='text-muted-foreground'>
              Gestiona las zonas de la plataforma
            </p>
          </div>
          <ZonesPrimaryButtons />
        </div>
        <div className='lg:flex-row flex-1 lg:space-x-12 lg:space-y-0 -mx-4 px-4 py-1 overflow-auto'>
          <ZonesTable />
        </div>
      </Main>
    </ZonesProvider>
  )
}