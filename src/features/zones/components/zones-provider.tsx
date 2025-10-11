"use client"

import useDialogState from '@/hooks/use-dialog-state'
import { Zone } from '@/types/zone'
import React, { useMemo, useState } from 'react'

type ZonesDialogType = 'delete'

type ZonesContextType = {
  open: ZonesDialogType | null
  setOpen: (str: ZonesDialogType | null) => void
  currentRow: Zone | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Zone | null>>
}

const ZonesContext = React.createContext<ZonesContextType | null>(null)

export function ZonesProvider({ children }: { readonly children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ZonesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Zone | null>(null)

  const zonesContextValue = useMemo(() => ({
    open,
    setOpen,
    currentRow,
    setCurrentRow,
  }), [open, setOpen, currentRow, setCurrentRow])

  return (
    <ZonesContext value={zonesContextValue}>
      {children}
    </ZonesContext>
  )
}

export const useZones = () => {
  const zonesContext = React.useContext(ZonesContext)

  if (!zonesContext) {
    throw new Error('useZones has to be used within <ZonesContext>')
  }

  return zonesContext
}
