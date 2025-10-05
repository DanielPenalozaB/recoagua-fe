"use client"

import useDialogState from '@/hooks/use-dialog-state'
import { Level } from '@/types/level'
import React, { useMemo, useState } from 'react'

type LevelsDialogType = 'delete'

type LevelsContextType = {
  open: LevelsDialogType | null
  setOpen: (str: LevelsDialogType | null) => void
  currentRow: Level | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Level | null>>
}

const LevelsContext = React.createContext<LevelsContextType | null>(null)

export function LevelsProvider({ children }: { readonly children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<LevelsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Level | null>(null)

  const challengesContextValue = useMemo(() => ({
    open,
    setOpen,
    currentRow,
    setCurrentRow,
  }), [open, setOpen, currentRow, setCurrentRow])

  return (
    <LevelsContext value={challengesContextValue}>
      {children}
    </LevelsContext>
  )
}

export const useLevels = () => {
  const challengesContext = React.useContext(LevelsContext)

  if (!challengesContext) {
    throw new Error('useLevels has to be used within <LevelsContext>')
  }

  return challengesContext
}
