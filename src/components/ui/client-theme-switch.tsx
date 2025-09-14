"use client"

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const ThemeSwitch = dynamic(() => import('./theme-switch').then(mod => mod.ThemeSwitch), {
  ssr: false,
  loading: () => <Skeleton className="rounded-full w-9 h-9" />
})

export default ThemeSwitch