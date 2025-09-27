"use client"

import useDialogState from '@/hooks/use-dialog-state'
import { Region } from '@/types/region'
import React, { useMemo, useState } from 'react'

type RegionsDialogType = 'delete'

type RegionsContextType = {
  open: RegionsDialogType | null
  setOpen: (str: RegionsDialogType | null) => void
  currentRow: Region | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Region | null>>
}

const RegionsContext = React.createContext<RegionsContextType | null>(null)

export function RegionsProvider({ children }: { readonly children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<RegionsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Region | null>(null)

  const regionsContextValue = useMemo(() => ({
    open,
    setOpen,
    currentRow,
    setCurrentRow,
  }), [open, setOpen, currentRow, setCurrentRow])

  return (
    <RegionsContext value={regionsContextValue}>
      {children}
    </RegionsContext>
  )
}

export const useRegions = () => {
  const regionsContext = React.useContext(RegionsContext)

  if (!regionsContext) {
    throw new Error('useRegions has to be used within <RegionsContext>')
  }

  return regionsContext
}
