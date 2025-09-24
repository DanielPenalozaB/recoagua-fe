'use client'

import { useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function useAuth(required = true) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (required && !session) {
      signOut({ callbackUrl: '/' })
      router.push('/auth/signin')
    }
  }, [session, status, router, required])

  return {
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
  }
}